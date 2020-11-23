//
// Ruta: /api/users
//
const { Router } = require('express');
const { check } = require('express-validator'); // 8.7
const { validate } = require('../middleware/validate'); // 8.8
//
// Cargar mis controladores para asociarlos a la ruta
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
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
router.get('/', validateJWT, getUsers);
router.get('/:id', [validateJWT], getUserById);

router.post('/', [
    check('name', 'Nombre es obligatorio').not().isEmpty(),
    check('email', 'Email require formato correo').isEmail(),
    check('password', 'Password es obligatorio').not().isEmpty(),
    validate
], createUser);

// 14.2 - añadir validación de token
router.put('/:id', [
    validateJWT,
    check('name', 'Nombre es obligatorio').not().isEmpty(),
    check('email', 'Email require formato correo').isEmail(),
    check('role', 'Role es obligatorio').not().isEmpty(),
    validate
], updateUser);

// 14.2 - añadir validación de token
router.delete('/:id', [validateJWT], deleteUser);

router.use('/api/v1', router);

module.exports = router;