import { Router } from 'express';
const router = Router();
import { ContactsController } from '../controllers/ContactsController';
import { PaymentController } from '../controllers/PaymentController';
import { isAuthenticated } from '../app';
import passport from 'passport';
const controllerContacts = new ContactsController();
const controllerPayment = new PaymentController();

// Rutas públicas
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

router.post('/contact/add', controllerContacts.add.bind(controllerContacts));
router.post('/payment/add', controllerPayment.processPayment.bind(controllerPayment));

// Rutas protegidas
router.get('/admin/contacts_list', isAuthenticated, controllerContacts.index.bind(controllerContacts));
router.get('/admin/payments_list', isAuthenticated, controllerPayment.listPayments.bind(controllerPayment));

declare global {
  namespace Express {
    interface Request {
      flash(type: string, message?: string | string[]): string[];
    }
  }
}

// Login
router.get('/auth/login', (req, res) => {
    res.render('login', { 
        message: req.flash('error'),
        title: 'Iniciar sesión - AquaClean',
        og: {
            title: 'Iniciar sesión - AquaClean',
            description: 'Accede al panel de administración de AquaClean'
        }
    });
});

router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Login con Google (opcional)
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/admin',
    failureRedirect: '/auth/login'
}));

// Logout
router.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Panel de administración
router.get('/admin', isAuthenticated, (req, res) => {
    res.render('dashboard', { 
        user: req.user,
        title: 'Panel de administración - AquaClean'
    });
});

export default router;