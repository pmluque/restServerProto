//
// Ruta: /api/doctors
//
const { Router } = require('express');
const { check } = require('express-validator'); // 8.7
const { getDoctors, deleteDoctor, createDoctor, updateDoctor } = require('../controllers/doctor.controller');
const { validate } = require('../middleware/validate'); // 8.8
//
// Cargar mis controladores para asociarlos a la ruta

// 14.1 - leer token de los headers
const { validateJWT } = require('../middleware/validate-jwt');
//
const router = Router();


router.get('/', [], getDoctors);

router.post('/', [
    validateJWT,
    check('name', 'El nombre del médico es obligatorio').not().isEmpty(),
    check('hospital', 'El ID de hospital debe ser válido').isMongoId(),
    validate // este validate coge el resultado de todos los check y detiene el proceso si no cumplen las reglas.
], createDoctor);

router.put('/:id', [], updateDoctor);

router.delete('/:id', [], deleteDoctor);

module.exports = router;

// SIGUIENTE PASO: Crear controlador