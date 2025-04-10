"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Motor de vistas
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
// Rutas
const index_1 = __importDefault(require("./routes/index"));
app.use('/', index_1.default);
exports.default = app;
