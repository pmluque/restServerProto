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
            err: error
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
            err: error
        });
    }
}

const updateHospital = async(req, res = response) => {

    const id = req.params.id; // id del hospital
    const uid = req.uid; // el middleware validateJWT ha añadido este campo a mi req.

    // realizar proceso de actualización
    try {
        // Ref. a ver si existe un hospital
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {

            return res.status(404).json({
                ok: false,
                msg: 'No se encontrol el hospital!',
                err: `Hospital con id ${id} no existe`
            });

        }

        // actualizar nombre
        // hospital.name = req.body.name; (para una propiedad esta bien, pero no para un grupo)
        const updateProperties = {
            ...req.body,
            user: uid
        };

        const hospitalUPD = await Hospital.findByIdAndUpdate(id, updateProperties, { new: true });

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Hospital actualizado',
            data: { 'old': hospitalDB, 'new': hospitalUPD }
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado durante actualización hospital!',
            err: error
        });
    }
}

const deleteHospital = async(req, res = response) => {

    const id = req.params.id; // id del hospital
    const uid = req.uid; // el middleware validateJWT ha añadido este campo a mi req.

    // realizar proceso de actualización
    try {
        // Ref. a ver si existe un hospital
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {

            return res.status(404).json({
                ok: false,
                msg: 'No se encontrol el hospital!',
                err: `Hospital con id ${id} no existe`
            });

        }

        await Hospital.findByIdAndDelete(id);

        // llamada
        res.status(200).json({
            ok: true,
            msg: 'Hospital borrado',
            data: hospitalDB
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado durante borrado de hospital!',
            err: error
        });
    }
}

module.exports = { getHospitals, createHospital, updateHospital, deleteHospital }