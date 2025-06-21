import { getDbConnection } from '../database/connection';
import { Database } from 'sqlite';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export interface User {
    id: number;
    username: string;
    password_hash: string;
    created_at: string;
}

export class UserModel {
    private db: Promise<Database>;

    constructor() {
        this.db = getDbConnection();
        this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        const db = await this.db;
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password_hash TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Crear usuario admin por defecto si no existe
        const adminExists = await db.get('SELECT id FROM users WHERE username = ?', ['admin']);
        if (!adminExists) {
            const defaultPassword = 'admin123';
            const hash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);
            await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['admin', hash]);
        }
    }

    async findByUsername(username: string): Promise<User | undefined> {
        const db = await this.db;
        return db.get('SELECT * FROM users WHERE username = ?', [username]);
    }

    async createUser(username: string, password: string): Promise<void> {
        const db = await this.db;
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    }

    async verifyPassword(username: string, password: string): Promise<boolean> {
        const user = await this.findByUsername(username);
        if (!user) return false;
        return bcrypt.compare(password, user.password_hash);
    }
}