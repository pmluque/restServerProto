// Importar objetos para tener información acerca de ellos
const { response } = require('express');
// const { validationResult } = require('express-validator'); // 8.7 : capturadores de errores || 8.8 movido al middleware
// 9.1 Encriptación
const bcryt = require('bcryptjs');

// Importaciones de modelos
const User = require('../models/user.model');
// 13.1 - devolver token 
const { generateJWT } = require('../helpers/jwt.helper');

const getUsers = async(req, res = response) => {

    try {
        // 15.7 - PAGINACIÓN: recoger parámetros de la url from/to
        // http://localhost:3000/api/users?from=5&to=10
        const from = Number(req.query.from) | 0;
        console.log('user.controller.getUsers() from=', from);

        // lanzar 2 procesos de forma simultánea > Promise.all([ejecuta todas estas promesas])
        /*
         const users = await User.find({}, 'name email role google')
            .skip(from)
            .limit(5);
         const total = await User.count();
        */
        const [users, total] = await Promise.all([
            User.find({}, 'name email role google img')
            .skip(from)
            .limit(5), User.countDocuments()
        ]);

        res.status(200).json({
            ok: true,
            msg: 'Resultado de la búsqueda de usuarios',
            data: {
                users,
                uid: req.uid,
                total
            }
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al buscar usuarios',
            err: error
        });
    }


}

/**
 *
 *  decir igual a response ayuda a decirle a node que por defecto es un res 
 */
const createUser = async(req, res = response) => {

    // const body= req.body; -> mejor desestructurado
    const { email, password } = req.body;
    console.log('Params :', req.body);
    // validaciones
    /* Se mueve al middleware 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            msg: 'Hay datos obligatorios que no se enviaron',
            err: errors.mapped()
        });
    }
    */
    // realizar proceso de creación
    try {
        const userDB = await User.findOne({ email });
        if (userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Este usuario ya existe!',
                data: { email }
            });
        }
        // importar modelo User
        const user = new User(req.body);
        // 9.1 - Encriptar
        const salt = bcryt.genSaltSync();
        user.password = bcryt.hashSync(password, salt);

        // Escribir en base de datos (es una promesa de moogose)
        await user.save();

        // 13.1 - tras guardar usuario, devolver token
        const token = await generateJWT(user.id);


        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Usuario creado!',
            data: { user, token }
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo crear el usuario!',
            error
        });
    }
}

const updateUser = async(req, res = response) => {

    const uid = req.params.id;
    console.log('updateUser uid =', uid);
    // realizar proceso de actualización
    try {

        const userDB = await User.findById(uid);
        // const userDB = await User.findOne({ _id: mongoose.ObjectId(uid) });
        if (!userDB) {
            // 404 no encontrado
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario!',
                data: { uid }
            });
        }
        // Retiro campos que no se deben actualizar aunque se manden.
        const { password, google, email, ...fields } = req.body;

        // Comprobar que son el peticionario coincide con el recogido
        //if (userDB.email === email) {
        //    delete email; // para que no choque con la validación de email único
        //} else {
        if (userDB.email !== email) {
            const existEmail = await User.findOne({ email });
            if (existEmail) {
                res.status(400).json({
                    ok: false,
                    msg: 'Ya existe usuario con ese email !',
                    data: { email }
                });
            }
        }

        fields.email = email; //agregarlo.

        // delete fields.password;
        // delete fields.google;

        // Escribir en base de datos (es una promesa de moogose)
        const userUpdated = await User.findByIdAndUpdate(uid, fields, { new: true, useFindAndModify: false }); // new:true para que regrese el actualizado
        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Usuario actualizado!',
            data: { userUpdated }
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado !',
            error
        });
    }
}

const deleteUser = async(req, res = response) => {

    const uid = req.params.id;
    console.log('deleteUser uid =', uid);
    // realizar proceso de actualización
    try {

        const userDB = await User.findById(uid);
        // const userDB = await User.findOne({ _id: mongoose.ObjectId(uid) });
        if (!userDB) {
            // 404 no encontrado
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario para borrar!',
                data: { uid }
            });
        }

        // Escribir en base de datos (es una promesa de moogose)
        const userDeleted = await User.findByIdAndDelete(uid);
        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado!',
            data: { userDeleted }
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado !',
            error
        });
    }
}

module.exports = { getUsers, createUser, updateUser, deleteUser }