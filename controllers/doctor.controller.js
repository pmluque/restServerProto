// -----------------------------------------------------
//  15.3 - Controlador con endpoints
//  modelo > rutas (index) > rutas( routes) > controlador
// -----------------------------------------------------
// Importar objetos para tener información acerca de ellos
const { response } = require('express');
const bcryt = require('bcryptjs');

// Importaciones de modelos
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt.helper');

const getDoctors = async(req, res = response) => {

    try {
        const doctorsDB = await Doctor.find({})
            .populate('user', 'name email avatar')
            .populate('hospital', 'name img');

        res.status(200).json({
            ok: true,
            msg: 'Se retornaron los doctores consultados',
            data: { doctors: doctorsDB }
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al recuperar doctores',
            err: { error }
        });
    }
}

const createDoctor = async(req, res = response) => {

    const uid = req.uid; // campo agregado por validateToken
    const doctor = new Doctor({ user: uid, ...req.body });

    // realizar proceso de creación
    try {

        const doctorDB = await doctor.save();
        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Doctor creado!',
            data: doctorDB
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo crear el Doctor!',
            error
        });
    }
}

/*
   Necesita el name => validación no vacio
{
                "_id": "5fb3c9e364342a2470ee4d4d",
                "user": {
                    "_id": "5fb3bf60659acb17f8415498",
                    "name": "Mike",
                    "email": "mike@test.com"
                },
                "name": "Victor Sandoval Gutierrez",
                "hospital": {
                    "_id": "5fb3c36ad9abb42ee4705c28",
                    "name": "Gregorio Marañon",
                    "img": "./uploads/hospitals/05d4b9bf-2d85-4688-9d04-e065199b71ac.jpg"
                }
            }

    y el id del hospital : hospital  => validación isMondoId()
            {
                "_id": "5fba8afa284b144090ea5569",
                "user": {
                    "_id": "5fad872218f74231fcd25e9f",
                    "name": "Silvia",
                    "email": "silvia@test.com"
                },
                "name": "Hospital Reina Sofia"
            }

*/
const updateDoctor = async(req, res = response) => {

    const id = req.params.id; // id del doctor
    const uid = req.uid; // el middleware validateJWT ha añadido este campo a mi req.

    // realizar proceso de actualización
    try {
        // Ref. a ver si existe un hospital
        const doctorDB = await Doctor.findById(id);

        if (!doctorDB) {

            return res.status(404).json({
                ok: false,
                msg: 'No se encontrol del doctor!',
                err: `Doctor con id ${id} no existe`
            });

        }

        // actualizar nombre
        // hospital.name = req.body.name; (para una propiedad esta bien, pero no para un grupo)
        const updateProperties = {
            ...req.body,
            user: uid
        };

        const doctorUPD = await Doctor.findByIdAndUpdate(id, updateProperties, { new: true });

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Doctor actualizado',
            data: { 'old': doctorDB, 'new': doctorUPD }
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado durante actualización del doctor!',
            err: error
        });
    }
}

const deleteDoctor = async(req, res = response) => {

    const id = req.params.id; // id del medico
    const uid = req.uid; // el middleware validateJWT ha añadido este campo a mi req.

    // realizar proceso de actualización
    try {
        // Ref. a ver si existe un hospital
        const doctorDB = await Doctor.findById(id);

        if (!doctorDB) {

            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el doctor!',
                err: `Doctor con id ${id} no existe`
            });

        }

        await Doctor.findByIdAndDelete(id);

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Doctor borrado',
            data: doctorDB
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado durante borrado del doctor!',
            err: error
        });
    }
}

module.exports = { getDoctors, createDoctor, updateDoctor, deleteDoctor }