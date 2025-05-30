import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface PaymentData {
    amount: number;
    cardNumber: string;
    cvv: string;
    expirationMonth: string;
    expirationYear: string;
    fullName: string;
    currency: string;
    description?: string;
    reference?: string;
}

interface PaymentResponse {
    status: 'APPROVED' | 'REJECTED' | 'ERROR' | 'INSUFFICIENT';
    transactionId?: string;
    errorCode?: string;
    message: string;
}

export async function processFakePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
        const response = await axios.post(
            `${process.env.FAKE_PAYMENT_API_URL}/payments`,
            {
                amount: paymentData.amount.toString(),
                "card-number": paymentData.cardNumber, 
                "cov": paymentData.cvv, 
                "expiration-month": paymentData.expirationMonth,
                "expiration-year": paymentData.expirationYear,
                "full-name": paymentData.fullName,
                currency: paymentData.currency,
                description: paymentData.description || "Payment for service",
                reference: paymentData.reference || `payment_${Date.now()}`
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.FAKE_PAYMENT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            status: 'APPROVED',
            transactionId: response.data.transaction_id,
            message: 'Payment processed successfully'
        };
    } catch (error: any) {
        if (error.response) {
            const errorCode = error.response.data.error_code || '000';
            let status: 'REJECTED' | 'ERROR' | 'INSUFFICIENT' = 'ERROR';
            let message = 'Payment processing error';

            switch(errorCode) {
                case '001': message = 'Invalid card number'; break;
                case '002': status = 'REJECTED'; message = 'Payment rejected'; break;
                case '003': message = 'Payment error'; break;
                case '004': status = 'INSUFFICIENT'; message = 'Insufficient funds'; break;
            }

            return { status, errorCode, message };
        } else {
            return { 
                status: 'ERROR', 
                errorCode: '000', 
                message: 'Network error processing payment' 
            };
        }
    }
}