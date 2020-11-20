// Importar objetos para tener información acerca de ellos
const { response } = require('express');
// const { validationResult } = require('express-validator'); // 8.7 : capturadores de errores || 8.8 movido al middleware
// 9.1 Encriptación
const bcryt = require('bcryptjs');

// 13.1 - devolver token 
const { generateJWT } = require('../helpers/jwt.helper');
const User = require('../models/user.model');
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');

// Test:
// http://localhost:3000/api/global/search/Silvia   <- busca Silvia
// http://localhost:3000/api/global/search/usu      <- buscar usu%
// http://localhost:3000/api/global/search/i        <- buscar i%
const getAllEntities = async(req, res = response) => {

    try {

        const pattern = req.params.pattern;
        const regex = new RegExp(pattern, 'i'); // i:insensible

        /* secuencial
        const users = await User.find({ name: regex });
        const hospitals = await Hospital.find({ name: regex });
        const doctors = await Doctor.find({ name: regex });
        */
        // paralela
        const [users, hospitals, doctors] = await Promise.all([
            User.find({ name: regex }),
            Hospital.find({ name: regex }),
            Doctor.find({ name: regex })
        ]);

        res.status(200).json({
            ok: true,
            msg: 'Resultado de la búsqueda',
            data: {
                pattern,
                users,
                hospitals,
                doctors
            }
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al buscar',
            err: error
        });
    }


}

// Test: http://localhost:3000/api/search/hospitals/i
const getAllCollections = async(req, res = response) => {

    try {

        const table = req.params.table;
        const pattern = req.params.pattern;
        const regex = new RegExp(pattern, 'i'); // i:insensible

        let data = [];

        switch (table) {
            case 'doctors':
                data = await Doctor.find({ name: regex })
                    .populate('user', 'name email')
                    .populate('hospital', 'name');
                break;

            case 'hospitals':
                data = await Hospital.find({ name: regex })
                    .populate('user', 'name email');
                break;

            case 'users':
                data = await User.find({ name: regex });
                break;

            default:
                return res.status(400).json({
                    ok: false,
                    msg: `Tabla ${table} no reconocida`,
                    err: {
                        error: 'La tabla no es: hospitals | users | doctors'
                    }
                });
        }

        res.status(200).json({
            ok: true,
            msg: 'Resultado de la búsqueda',
            data
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al buscar',
            err: error
        });
    }


}

module.exports = { getAllEntities, getAllCollections }