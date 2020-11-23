// Importar objetos para tener información acerca de ellos
const { response } = require('express');
const User = require('../models/user.model');
const bcryt = require('bcryptjs');
// 12
const { generateJWT } = require('../helpers/jwt.helper');
const { googleVerify } = require('../helpers/google-verify.helper');

const login = async(req, res = response) => {

    const { email, password } = req.body;
    // console.log('login :', email, password);

    try {

        // Comprobar que existe el usuario

        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no registrado!',
                data: { email }
            });
        }
        // console.log('userDB :', userDB);

        // Verificar contraseña
        const validPassword = bcryt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no reconocido!',
                data: { email }
            });
        }


        // Generar un token : importar función del helpers
        const token = await generateJWT(userDB.id);

        // Respuesta correcta
        res.status(200).json({
            ok: true,
            msg: 'Login autorizado',
            data: { token }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.',
            err: error
        });
    }
}

//
// Controlador
// Test: 
//        1. Usar la página index.html para coger un token valido
//        2. Configurar el servicio poniendo en el payload el token valido. 
//        3. Llamar al servicio http://localhost:3000/api/login/google
//
// https://developers.google.com/identity/sign-in/web/backend-auth
//
const loginGoogle = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        const googleData = await googleVerify(id_token);
        const { email, given_name, family_name, img } = googleData;
        // Control de existencia en mi BD
        const userDB = await User.findOne({ email });
        let user;

        if (!userDB) { // no existe
            user = new User({
                name: `${given_name} ${family_name}`,
                email,
                password: '@@@@',
                img,
                google: true
            });
        } else { // existe
            user = userDB;
            user.google = true;
        }
        // Guardar en base de datos
        await user.save();

        // Generar un token : importar función del helpers
        const token = await generateJWT(user.id);

        // Respuesta correcta
        res.status(200).json({
            ok: true,
            msg: 'Login google autorizado',
            data: { token }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            err: {
                'cause #1': 'Token no valido',
                'cause #2': 'Token out-of-time',
                'default': error
            }
        });
    }
}


const renewToken = async(req, res = response) => {

    const uid = req.uid;

    try {

        // Generar un token : importar función del helpers
        const token = await generateJWT(uid);

        // Respuesta correcta
        res.status(200).json({
            ok: true,
            msg: 'Login google autorizado',
            data: { uid }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            err: {
                'default': error
            }
        });
    }
}


module.exports = { login, loginGoogle, renewToken }