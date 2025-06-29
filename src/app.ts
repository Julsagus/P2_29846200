import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import i18n from 'i18n';
import cookieParser from 'cookie-parser';

import './config/passport';

dotenv.config();

const app = express();

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    }
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(cookieParser()); // <-- Agrega esto antes de i18n.init

// Configuración de i18n
i18n.configure({
    locales: ['es', 'en'],
    directory: path.join(__dirname, '../src/locale'),
    defaultLocale: 'es',
    objectNotation: true,
    autoReload: true,
    updateFiles: false,
    syncFiles: false,
    cookie: 'locale'
});

app.use(i18n.init);

// Middleware para pasar el idioma actual a las vistas
app.use((req, res, next) => {
    res.locals.locale = req.getLocale();
    next();
});

app.use((req, res, next) => {
    console.log('Idioma actual:', req.getLocale(), 'Cookie:', req.cookies?.locale);
    next();
});

// Motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware para agregar metadatos Open Graph
app.use((req, res, next) => {
    res.locals.og = {
        title: 'AquaClean - Soluciones de limpieza',
        description: 'Ofrecemos los mejores servicios de limpieza para tu hogar o negocio',
        image: '/public/images/logo.png',
        url: process.env.BASE_URL || 'https://p2-29846200-1qu7.onrender.com'
    };
    next();
});

// Rutas
import indexRouter from './routes/index';
app.use('/', indexRouter);

// Middleware de autenticación
export function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login');
}

export default app;