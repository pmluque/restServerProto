//
// Ruta: /api/login
//
const { Router } = require('express');
const { check } = require('express-validator');
const { login, loginGoogle, renewToken } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
// 20
const { validateJWT } = require('../middleware/validate-jwt');

const router = Router();

router.post('/', [
    check('email', 'Email obligatorio').isEmail(),
    check('password', 'Password obligatoria').not().isEmpty(),
    validate
], login);

router.post('/google', [
    check('id_token', 'Token Google es obligatorio').not().isEmpty(),
    validate
], loginGoogle);

router.get('/renew', [
    validateJWT
], renewToken);

router.use('/api/v1', router);

module.exports = router;