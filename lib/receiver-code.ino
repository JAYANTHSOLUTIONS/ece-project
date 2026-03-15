#include <SPI.h>
#include <LoRa.h>

// --- NodeMCU LoRa Pins ---
#define SS 15    // D8 - Chip Select
#define RST 16   // D0 - Reset
#define DIO0 5   // D1 - DIO0 interrupt

void setup() {
    Serial.begin(115200);
    while (!Serial);

    Serial.println("\n------------------------------------");
    Serial.println("   COAL MINE SAFETY STATION ACTIVE  ");
    Serial.println("------------------------------------");

    // Initialize LoRa
    LoRa.setPins(SS, RST, DIO0);

    if (!LoRa.begin(433E6)) {
        Serial.println("LoRa Initialization: [FAILED]");
        while (1); 
    }

    // --- MUST MATCH TRANSMITTER SETTINGS ---
    LoRa.setSyncWord(0xF3);           // Unique ID to filter noise
    LoRa.setSpreadingFactor(12);     // Maximum range/stability
    LoRa.setSignalBandwidth(125E3);
    
    Serial.println("LoRa Receiver: [READY]");
    Serial.println("Awaiting worker telemetry...");
}

void loop() {
    // Check if LoRa packet received
    int packetSize = LoRa.parsePacket();
    
    if (packetSize) {
        String receivedData = "";
        while (LoRa.available()) {
            receivedData += (char)LoRa.read();
        }

        // Validate data contains expected telemetry tags
        if (receivedData.indexOf("BAT") >= 0 || receivedData.indexOf("HR") >= 0) {
            Serial.println("\n[--- WORKER UPDATE RECEIVED ---]");
            
            // Format the display with pipe separators
            String displayData = receivedData;
            displayData.replace(",", " | ");
            Serial.print("TELEMETRY: ");
            Serial.println(displayData);

            // Display signal strength
            Serial.print("Signal Strength (RSSI): ");
            Serial.print(LoRa.packetRssi());
            Serial.println(" dBm");

            // Parse and display violations
            if (receivedData.indexOf("B:U") >= 0) {
                Serial.println("(!) ALERT: BELT UNLOCKED");
            }
            if (receivedData.indexOf("H:N") >= 0) {
                Serial.println("(!) ALERT: HELMET REMOVED");
            }
            
            // Parse gas levels
            int gasStart = receivedData.indexOf("G:") + 2;
            int gasEnd = receivedData.indexOf(",", gasStart);
            if (gasEnd == -1) gasEnd = receivedData.length();
            String gasStr = receivedData.substring(gasStart, gasEnd);
            int gasValue = gasStr.toInt();
            if (gasValue > 700) {
                Serial.println("(!) ALERT: HIGH GAS LEVEL");
            }
            
            // Parse temperature
            int tempStart = receivedData.indexOf("T:") + 2;
            int tempEnd = receivedData.indexOf(",", tempStart);
            if (tempEnd == -1) tempEnd = receivedData.length();
            String tempStr = receivedData.substring(tempStart, tempEnd);
            float tempValue = tempStr.toFloat();
            if (tempValue > 45) {
                Serial.println("(!) ALERT: HIGH TEMPERATURE");
            }
            
            Serial.println("-------------------------------");
        }
    }
}
