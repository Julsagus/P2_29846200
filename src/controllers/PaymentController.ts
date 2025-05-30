import { Request, Response } from 'express';
import { PaymentModel } from '../models/PaymentModel';
import { processFakePayment } from '../services/paymentService';
import { verifyRecaptcha } from '../services/RecaptchaService';

export class PaymentController {
    private model: PaymentModel;

    constructor() {
        this.model = new PaymentModel();
    }

    async processPayment(req: Request, res: Response): Promise<void> {
        const {
            plan,
            email,
            cardholder: fullName,
            cardnumber: cardNumber,
            exp_month: expirationMonth,
            exp_year: expirationYear,
            cvv,
            amount,
            currency,
            'g-recaptcha-response': recaptchaToken
        } = req.body;

        const ipAddress = req.ip || req.connection.remoteAddress || "unknown";

        // Validar reCAPTCHA
        if (!recaptchaToken) {
        res.redirect('/form_pay?error=recaptcha_missing');
        return;
        }
        
        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!isRecaptchaValid) {
            res.redirect('/form_pay?error=recaptcha_failed');
            return;
        }

        if (plan && email && fullName && cardNumber && expirationMonth && expirationYear && cvv && amount && currency) {
            // Procesar pago con Fake Payment API
            const paymentSuccess = await processFakePayment({
              amount: parseFloat(amount),
              cardNumber,
              cvv,
              expirationMonth,
              expirationYear,
              fullName, 
              currency,
              description: `Payment for plan: ${plan}`
          });

            if (paymentSuccess) {
                await this.model.addPayment(
                    plan,
                    email,
                    fullName,
                    cardNumber,
                    expirationMonth,
                    expirationYear,
                    cvv,
                    amount,
                    currency,
                    ipAddress
                );
                res.redirect('/send_payment');
            } else {
                res.redirect('/form_pay?error=payment_failed');
            }
        } else {
            res.redirect('/form_pay?error=missing_fields');
        }
    }

  async listPayments(req: Request, res: Response): Promise<void> {
    const payments = await this.model.getAllPayments();
    res.render('payments_list', { payments });
  }
}