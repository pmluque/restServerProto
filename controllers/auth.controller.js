// Importar objetos para tener información acerca de ellos
const { response } = require('express');
const User = require('../models/user.model');
const bcryt = require('bcryptjs');
// 12
const { generateJWT } = require('../helpers/jwt.helper');

const login = async(req, res = response) => {

    const { email, password } = req.body;
    console.log('login :', email, password);

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
        console.log('userDB :', userDB);

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

module.exports = { login }