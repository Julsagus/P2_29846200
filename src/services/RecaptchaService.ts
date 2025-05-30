import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function verifyRecaptcha(token: string): Promise<boolean> {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        );
        return response.data.success;
    } catch (error) {
        console.error('Error al verificar reCAPTCHA:', error);
        return false;
    }
}