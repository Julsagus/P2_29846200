// src/models/ContactsModel.ts
import { getDbConnection } from '../database/connection';
import { Database } from 'sqlite';

interface Contact {
  id: number;
  name: string;
  email: string;
  comment: string;
  ip_address: string;
  created_at: string;
}

export class ContactsModel {
  private db: Promise<Database>;

  constructor() {
    this.db = getDbConnection();
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    const db = await this.db;
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        comment TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  // Resto de los métodos permanecen igual...
  async addContact(name: string, email: string, comment: string, ipAddress: string): Promise<void> {
    const db = await this.db;
    await db.run(
      'INSERT INTO contacts (name, email, comment, ip_address) VALUES (?, ?, ?, ?)',
      [name, email, comment, ipAddress]
    );
  }

  async getAllContacts(): Promise<Contact[]> {
    const db = await this.db;
    return db.all('SELECT * FROM contacts ORDER BY created_at DESC');
  }
}