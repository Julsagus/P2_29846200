// src/database/database.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Configuración de la conexión
const DB_FILE = './database.sqlite';

// Variable para almacenar la instancia de la base de datos
let db: Database | null = null;

export async function getDbConnection(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });
    
    console.log('Conexión a SQLite establecida');
  }
  
  return db;
}

// Función para cerrar la conexión (útil para tests o reinicios)
export async function closeConnection(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('Conexión a SQLite cerrada');
  }
}