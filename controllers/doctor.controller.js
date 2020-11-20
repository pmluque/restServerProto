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

const updateDoctor = async(req, res = response) => {

    // realizar proceso de actualización
    try {

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Doctor actualizado!',
            data: {}
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado durante actualización Doctor!',
            error
        });
    }
}

const deleteDoctor = async(req, res = response) => {

    // realizar proceso de borrado
    try {

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Doctor eliminado!',
            data: {}
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado durante borrado de Doctor !',
            error
        });
    }
}

module.exports = { getDoctors, createDoctor, updateDoctor, deleteDoctor }