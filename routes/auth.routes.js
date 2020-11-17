//
// Ruta: /api/login
//
const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const router = Router();

router.post('/', [
    check('email', 'Email obligatorio').isEmail(),
    check('password', 'Password obligatoria').not().isEmpty(),
    validate
], login);

module.exports = router;