// src/models/PaymentModel.ts
import { getDbConnection } from '../database/connection';
import { Database } from 'sqlite';

interface Payment {
  id: number;
  plan: string;
  email: string;
  cardholder: string;
  cardnumber: string; // En producción, esto debería estar encriptado
  exp_month: string;
  exp_year: string;
  cvv: string;       // En producción, NUNCA almacenar esto
  amount: number;
  currency: string;
  ip_address: string;
  created_at: string;
}

export class PaymentModel {
  private db: Promise<Database>;

  constructor() {
    this.db = getDbConnection();
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    const db = await this.db;
    await db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan TEXT NOT NULL,
        email TEXT NOT NULL,
        cardholder TEXT NOT NULL,
        cardnumber TEXT NOT NULL,
        exp_month TEXT NOT NULL,
        exp_year TEXT NOT NULL,
        cvv TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async addPayment(
    plan: string,
    email: string,
    cardholder: string,
    cardnumber: string,
    exp_month: string,
    exp_year: string,
    cvv: string,
    amount: number,
    currency: string,
    ipAddress: string
  ): Promise<void> {
    const db = await this.db;
    await db.run(
      `INSERT INTO payments (
        plan, email, cardholder, cardnumber, 
        exp_month, exp_year, cvv, amount, 
        currency, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plan, email, cardholder, cardnumber, exp_month, exp_year, cvv, amount, currency, ipAddress]
    );
  }

  async getAllPayments(): Promise<Payment[]> {
    const db = await this.db;
    return db.all('SELECT * FROM payments ORDER BY created_at DESC');
  }
}