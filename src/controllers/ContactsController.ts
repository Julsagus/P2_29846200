import { Request, Response } from 'express';
import { ContactsModel } from '../models/ContactsModel';
import { getCountryByIp } from '../services/ipService';
import { verifyRecaptcha } from '../services/RecaptchaService';
import { sendContactNotification } from '../services/emailService';

export class ContactsController {
    private model: ContactsModel;

    constructor() {
        this.model = new ContactsModel();
    }

    async add(req: Request, res: Response): Promise<void> {
        const { name, email, comment, 'g-recaptcha-response': recaptchaToken } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
        
        // Validar reCAPTCHA
        if (!recaptchaToken) {
        res.redirect('/contact?error=recaptcha_missing');
        return;
        }
        
        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!isRecaptchaValid) {
            res.redirect('/contact?error=recaptcha_failed');
            return;
        }

        if (name && email && comment) {
            // Obtener país por IP
            const country = await getCountryByIp(ipAddress);
            
            // Guardar en base de datos
            await this.model.addContact(name, email, comment, ipAddress, country);
            
            // Enviar notificación por email
            await sendContactNotification({
                name,
                email,
                comment,
                ip: ipAddress,
                country,
                date: new Date().toLocaleString(),
            });
            
            res.redirect('/send_form');
        } else {
            res.redirect('/contact?error=missing_fields');
        }
    }

  async index(req: Request, res: Response): Promise<void> {
    const contacts = await this.model.getAllContacts();
    res.render('contacts_list', { contacts });
  }
}