const express = require('express');
const router = express.Router();
const noticiaController = require('../controllers/noticiaController');

// Obtener noticias relacionadas (debe ir antes que /:id para evitar conflictos)
router.get('/relacionadas', noticiaController.getNoticiasRelacionadas);

// Obtener noticia por ID
router.get('/:id', noticiaController.getNoticiaById);

// Obtener todas las noticias (con filtros opcionales)
router.get('/', noticiaController.getNoticias);

module.exports = router;
