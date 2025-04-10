import { Router } from 'express';
const router = Router();

// Configura tus rutas aquí
router.get('/', (req, res) => {
    res.render('index');
});

// Exporta el router como default
export default router;