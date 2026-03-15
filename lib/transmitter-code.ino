#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include "MAX30105.h"           // Heart rate sensor
#include "heartRate.h"          
#include <DHT.h>                // Temperature & humidity sensor
#include <BLEDevice.h>          // Bluetooth for helmet detection
#include <BLEUtils.h>
#include <BLEScan.h>

// --- Pin Definitions ---
#define SCK 18                  // SPI Clock
#define MISO 19                 // SPI MISO
#define MOSI 23                 // SPI MOSI
#define SS 5                    // LoRa Chip Select
#define RST 14                  // LoRa Reset
#define DIO0 26                 // LoRa DIO0
#define DHTPIN 27               // DHT sensor pin
#define MQ2_PIN 34              // Gas sensor (MQ-9) analog pin
#define BELT_PIN 25             // Belt lock sensor
#define BUZZER_PIN 33           // Safety alert buzzer
#define BATTERY_PIN 35          // Battery voltage (via voltage divider)

// --- Global Objects ---
DHT dht(DHTPIN, DHT11);         // Temperature/humidity sensor
MAX30105 particleSensor;         // Heart rate sensor
BLEScan* pBLEScan;               // BLE scanner for helmet beacon

// --- Variables ---
const byte RATE_SIZE = 4;        // Moving average for heart rate
byte rates[RATE_SIZE]; 
byte rateSpot = 0;
long lastBeat = 0; 
int beatAvg = 0;                 // Average heart rate
bool helmetDetected = false;
String targetBeaconAddress = "b0:d2:78:48:39:65"; // Helmet beacon MAC
int rssiThreshold = -84;         // Helmet proximity threshold

void setup() {
    Serial.begin(115200);
    pinMode(BELT_PIN, INPUT_PULLUP);
    pinMode(BUZZER_PIN, OUTPUT);
    digitalWrite(BUZZER_PIN, LOW);
    
    // 1. Initialize LoRa
    SPI.begin(SCK, MISO, MOSI, SS);
    LoRa.setPins(SS, RST, DIO0);
    if (!LoRa.begin(433E6)) {
        Serial.println("LoRa Failed!");
        while(1);
    }

    // --- CRITICAL: MUST MATCH RECEIVER SETTINGS ---
    LoRa.setSyncWord(0xF3);       // Unique ID to filter noise
    LoRa.setSpreadingFactor(12);  // Maximum range & stability (SF7-12)
    LoRa.setSignalBandwidth(125E3); // 125 kHz bandwidth
    
    // 2. Initialize Sensors
    dht.begin();
    if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
        Serial.println("MAX30102 Fail");
    } else {
        particleSensor.setup(); 
        particleSensor.setPulseAmplitudeRed(0x0A); // Red LED brightness
    }

    // 3. Initialize BLE
    BLEDevice::init("");
    pBLEScan = BLEDevice::getScan();
    pBLEScan->setActiveScan(true);
    
    Serial.println("TRANSMITTER READY - SYNC WORD 0xF3");
}

void loop() {
    // Heart Rate Sensing - Check every loop
    long irValue = particleSensor.getIR();
    if (checkForBeat(irValue)) {
        long delta = millis() - lastBeat;
        lastBeat = millis();
        float bpm = 60 / (delta / 1000.0);
        if (bpm < 255 && bpm > 20) {
            rates[rateSpot++] = (byte)bpm;
            rateSpot %= RATE_SIZE;
            beatAvg = 0;
            for (byte x = 0; x < RATE_SIZE; x++) beatAvg += rates[x];
            beatAvg /= RATE_SIZE;
        }
    }

    // Send telemetry every 3 seconds
    static unsigned long lastReport = 0;
    if (millis() - lastReport > 3000) {
        // Battery Reading (0-100%)
        int rawADC = analogRead(BATTERY_PIN);
        float volt = (rawADC / 4095.0) * 3.3 * 2.0;
        int bat_per = map(volt * 100, 330, 420, 0, 100);
        bat_per = constrain(bat_per, 0, 100);

        // Temperature (°C)
        float temp = dht.readTemperature();
        
        // Gas Level (ppm equivalent from MQ-9 analog reading)
        int gasValue = analogRead(MQ2_PIN);
        
        // Belt Status (Locked=LOW, Unlocked=HIGH)
        bool beltLocked = (digitalRead(BELT_PIN) == LOW);
        
        // Helmet Detection via BLE
        BLEScanResults* foundDevices = pBLEScan->start(1, false); 
        helmetDetected = false;
        int currentRSSI = -100;
        for (int i = 0; i < foundDevices->getCount(); i++) {
            if (foundDevices->getDevice(i).getAddress().toString() == targetBeaconAddress) {
                currentRSSI = foundDevices->getDevice(i).getRSSI();
                if (currentRSSI > rssiThreshold) {
                    helmetDetected = true;
                }
                break;
            }
        }
        pBLEScan->clearResults();

        // Safety Logic: Alert if ANY violation
        bool unsafe = (!helmetDetected || !beltLocked || gasValue > 700 || temp > 45);
        digitalWrite(BUZZER_PIN, unsafe ? HIGH : LOW);

        // Construct LoRa packet
        String data = "BAT:" + String(bat_per) + 
                      ",HR:" + String(beatAvg) + 
                      ",T:" + String(temp) + 
                      ",G:" + String(gasValue) + 
                      ",B:" + (beltLocked ? "L" : "U") + 
                      ",H:" + (helmetDetected ? "Y" : "N");

        // Send via LoRa
        LoRa.beginPacket();
        LoRa.print(data);
        LoRa.endPacket();

        // Debug Output
        Serial.println("\n--- WORKER SAFETY STATUS ---");
        Serial.print("Data: "); Serial.println(data);
        Serial.print("RSSI: "); Serial.println(currentRSSI);
        if(unsafe) Serial.println(">>> ALERT: UNSAFE CONDITION! <<<");
        
        lastReport = millis();
    }
}
