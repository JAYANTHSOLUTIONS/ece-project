'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

// CREATE
export async function addWorker(name: string, id: string) {
  // We use backticks (`) for the JS string so we can use 
  // single quotes ('') for the SQL string literals 'U' and 'N'.
  const stmt = db.prepare(`
    INSERT INTO workers (
      id, name, battery, heartRate, temperature, 
      gasLevel, beltStatus, helmetStatus, rssi
    ) VALUES (?, ?, 0, 0, 0.0, 0, 'U', 'N', -100)
  `);
  
  stmt.run(id, name);
  revalidatePath('/'); // Forces the UI to show the new worker
}

// READ (Used in Server Components)
export async function getWorkers() {
  return db.prepare('SELECT * FROM workers ORDER BY name ASC').all();
}

// UPDATE (Manual Edit)
export async function updateWorkerName(id: string, newName: string) {
  db.prepare('UPDATE workers SET name = ? WHERE id = ?').run(newName, id);
  revalidatePath('/');
}

// DELETE
export async function deleteWorker(id: string) {
  db.prepare('DELETE FROM workers WHERE id = ?').run(id);
  revalidatePath('/');
}