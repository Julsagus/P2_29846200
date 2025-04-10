import express from 'express';
import path from 'path';

const app = express();

// Motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas
import indexRouter from './routes/index';
app.use('/', indexRouter);

export default app;