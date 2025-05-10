import { Request, Response } from 'express';
import { ContactsModel } from '../models/ContactsModel';

export class ContactsController {
  private model: ContactsModel;

  constructor() {
    this.model = new ContactsModel();
  }

  async add(req: Request, res: Response): Promise<void> {
    const { name, email, comment } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";

    if (name && email && comment) {
      await this.model.addContact(name, email, comment, ipAddress);
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