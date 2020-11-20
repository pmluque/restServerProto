//
// Ruta: /api/global
//
const { Router } = require('express');
const { getAllEntities, getAllCollections } = require('../controllers/search.controller');
//
// Cargar mis controladores para asociarlos a la ruta

// 14.1 - leer token de los headers
const { validateJWT } = require('../middleware/validate-jwt');
//
const router = Router();

// Consulta sobre todas las entidades
router.get('/:pattern', [validateJWT], getAllEntities);
// 15.9
router.get('/:table/:pattern', [validateJWT], getAllCollections);

module.exports = router;
// SIGUIENTE PASO: Crear controlador