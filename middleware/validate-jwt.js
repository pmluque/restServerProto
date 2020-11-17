//
// Middleware validaJWT : validar el token
// Recordar: es un controlador con la función next()
//
const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {

    // leer de los headers
    const token = req.header('x-token');
    console.log('middleware.validateJWT token=', token);
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición',
            err: { error: 'Token requerido llego nulo!' }
        });
    }

    // validar token || prueba: incluir un token recibido en una create o un login
    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        console.log('middleware.validateJWT uid=', uid);
        // añadir al request de información adicional para realizar nuevas verificaciones en la parte negocio
        req.uid = uid; // enviamos el uid 


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido',
            err: { error: 'Token no supero la validación!' }
        });
    }

    // Continuar el flujo
    next();
}

module.exports = { validateJWT };
// la llamada del middleware es desde las rutas de usuarios (user.routes)