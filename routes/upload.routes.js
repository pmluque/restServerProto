//
// Ruta: /api/upload
//    Ej.
//          /api/upload/user/123
//          /api/upload/doctor/123
//          /api/upload/hospital/123
//
const { Router } = require('express');
const { fileUpload, getImagen } = require('../controllers/upload.controller');
// 16.4
const fileUploadExpress = require('express-fileupload');
//
// Cargar mis controladores para asociarlos a la ruta

// 14.1 - leer token de los headers
const { validateJWT } = require('../middleware/validate-jwt');
//
const router = Router();

// 16.4 - usar el middleware
router.use(fileUploadExpress()); // asi ya se pasa por el middleare
//
// Actualizar la imagen a la entidad
router.put('/:type/:id', [validateJWT], fileUpload);
// Mostrar la imagen a la entidad
router.get('/:type/:photo', [validateJWT], getImagen);

router.use('/api/v1', router);

module.exports = router;
// SIGUIENTE PASO: Crear controlador