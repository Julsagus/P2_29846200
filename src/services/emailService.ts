import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendContactNotification(contactData: {
    name: string;
    email: string;
    comment: string;
    ip: string;
    country: string;
    date: string;
}): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: 'Nuevo contacto recibido',
        html: `
            <h1>Información recibida</h1>
            <p><strong>Nombre:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Comentario:</strong> ${contactData.comment}</p>
            <p><strong>IP:</strong> ${contactData.ip}</p>
            <p><strong>País:</strong> ${contactData.country}</p>
            <p><strong>Fecha:</strong> ${contactData.date}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email de notificación enviado');
    } catch (error) {
        console.error('Error al enviar email:', error);
    }
}