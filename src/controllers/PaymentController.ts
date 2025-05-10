// src/controllers/PaymentController.ts
import { Request, Response } from 'express';
import { PaymentModel } from '../models/PaymentModel';

export class PaymentController {
  private model: PaymentModel;

  constructor() {
    this.model = new PaymentModel();
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    const {
      plan,
      email,
      cardholder,
      cardnumber,
      exp_month,
      exp_year,
      cvv,
      amount,
      currency
    } = req.body;

    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";

    if (plan && email && cardholder && cardnumber && exp_month && exp_year && cvv && amount && currency) {
      await this.model.addPayment(
        plan,
        email,
        cardholder,
        cardnumber,
        exp_month,
        exp_year,
        cvv,
        amount,
        currency,
        ipAddress
      );
      res.redirect('/send_payment');
    } else {
      res.redirect('/form_pay?error=missing_fields');
    }
  }

  async listPayments(req: Request, res: Response): Promise<void> {
    const payments = await this.model.getAllPayments();
    res.render('payments_list', { payments });
  }
}