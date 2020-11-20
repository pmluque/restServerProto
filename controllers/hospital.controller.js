// -----------------------------------------------------
//  15.3 - Controlador con endpoints
//  modelo > rutas (index) > rutas( routes) > controlador
// -----------------------------------------------------
// Importar objetos para tener información acerca de ellos
const { response } = require('express');
const bcryt = require('bcryptjs');

// Importaciones de modelos
const Hospital = require('../models/hospital.model');
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt.helper');

const getHospitals = async(req, res = response) => {

    try {
        const hospitalesDB = await Hospital.find()
            .populate('user', 'name email avatar');

        res.status(200).json({
            ok: true,
            msg: 'Se retornaron los hospitales consultados',
            data: { hospitals: hospitalesDB }
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al recuperar hospitales',
            err: { error }
        });
    }
}

const createHospital = async(req, res = response) => {

    const uid = req.uid; // el middleware validateJWT ha añadido este campo a mi req.
    // Se desestructura y se añade la nueva propiedad user junto a las propiedades deel body
    const hospital = new Hospital({ user: uid, ...req.body });


    // realizar proceso de creación
    try {

        const hospitalDB = await hospital.save();

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Hospital creado!',
            data: hospitalDB
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo crear el hospital!',
            error
        });
    }
}

const updateHospital = async(req, res = response) => {

    // realizar proceso de actualización
    try {

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Hospital actualizado!',
            data: {}
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado durante actualización hospital!',
            error
        });
    }
}

const deleteHospital = async(req, res = response) => {

    // realizar proceso de borrado
    try {

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Hospital eliminado!',
            data: {}
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado durante borrado de hospital !',
            error
        });
    }
}

module.exports = { getHospitals, createHospital, updateHospital, deleteHospital }