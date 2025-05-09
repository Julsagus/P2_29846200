import { Router } from 'express';
const router = Router();
import { ContactsController } from '../controllers/ContactsController';
import { PaymentController } from '../controllers/PaymentController';

const controlerContacts = new ContactsController();
const controlerPayment = new PaymentController();
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/planes', (req, res) => {
    res.render('planes');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/form_pay', (req, res) => {
    res.render('form_pay');
});

router.get('/send_form', (req, res) => {
    res.render('send_form');
});

router.get('/send_payment', (req, res) => {
    res.render('send_payment');
});

router.post('/contact/add', controlerContacts.add.bind(controlerContacts));

router.get('/admin/contacts_list', controlerContacts.index.bind(controlerContacts));

router.post('/payment/add', controlerPayment.processPayment.bind(controlerPayment));

router.get('/admin/payments_list', controlerPayment.listPayments.bind(controlerPayment));

export default router;