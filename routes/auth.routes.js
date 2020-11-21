//
// Ruta: /api/login
//
const { Router } = require('express');
const { check } = require('express-validator');
const { login, loginGoogle } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const router = Router();

router.post('/', [
    check('email', 'Email obligatorio').isEmail(),
    check('password', 'Password obligatoria').not().isEmpty(),
    validate
], login);

router.post('/google', [
    check('id_token', 'Token Google es obligatoria').not().isEmpty(),
    validate
], loginGoogle);

module.exports = router;