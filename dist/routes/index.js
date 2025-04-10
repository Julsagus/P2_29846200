"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Configura tus rutas aquí
router.get('/', (req, res) => {
    res.render('index');
});
// Exporta el router como default
exports.default = router; // ¡Esta línea es crucial!
