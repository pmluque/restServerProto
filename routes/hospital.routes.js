//
// Ruta: /api/hospitals
//
const { Router } = require('express');
const { check } = require('express-validator'); // 8.7
const { getHospitals, deleteHospital, createHospital, updateHospital } = require('../controllers/hospital.controller');
const { validate } = require('../middleware/validate'); // 8.8
//
// Cargar mis controladores para asociarlos a la ruta

// 14.1 - leer token de los headers
const { validateJWT } = require('../middleware/validate-jwt');
//
const router = Router();

//Original
//app.get('/api/users', (req, res) => {
//    res.status(400).json({ ok: true, msg: 'Error !' });
//});

// Adaptación al controller

// Consulta de usuarios
// router.get('/', getUsers);
// 14.1 - Invocar al middleware de validación antes de seguir con la consulta de negocio
//        Para las pruebas usar en Headers -> key: x-token | value: 123456 => luego poner uno válido
router.get('/', [], getHospitals);

router.post('/', [
    validateJWT,
    check('name', 'El nombre del hospital es obligatorio').not().isEmpty(),
    validate // este validate coge el resultado de todos los check y detiene el proceso si no cumplen las reglas.
], createHospital);


router.put('/:id', [
    validateJWT,
    check('name', 'El nombre del hospital es obligatorio').not().isEmpty(),
    validate // este validate coge el resultado de todos los check y detiene el proceso si no cumplen las reglas.
], updateHospital);

router.delete('/:id', [validateJWT], deleteHospital);

router.use('/api/v1', router);

module.exports = router;

// SIGUIENTE PASO: Crear controlador