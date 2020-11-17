// -----------------------------------------------
//
// Paquete requerido: $ npm install jsonwebtoken --save
//
const jwt = require('jsonwebtoken')
    // Esta función sign trabaja con callback y se requiere que sea sincrona
    // Hay que ver cómo hacer para que devuelva una promesa o un observable
const generateJWT = (uid) => {

    // transformar en una promesa
    // 1. return Promise  || 2. meto el contenido | 3. devolver el error en el reject | 4. devolver la data en resolve
    return new Promise((resolve, reject) => {

        // añadir propiedades pero nunca sensible (ej. añadir nombre, role , etc)
        const payload = { uid };
        // invocar la firma con el payload y la semilla secreta (guardar en .env).
        // esta función devuelve un callback (err,token)
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' },
            (err, token) => {
                if (err) {
                    console.log('helpers.generateJWT Error:', err);
                    reject('helpers.generateJWT Error:', err);
                } else {
                    resolve(token);
                }
            });

    });
}

module.exports = { generateJWT }
    // Ir al auth.controller.js y usar la función