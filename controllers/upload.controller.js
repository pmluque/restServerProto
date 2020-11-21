// 17
const path = require('path');
const fs = require('fs');

// ==============================================================
// Importar objetos para tener información acerca de ellos
const { response } = require('express');
// 9.1 Encriptación
const bcryt = require('bcryptjs');

// 13.1 - devolver token 
const { generateJWT } = require('../helpers/jwt.helper');
const User = require('../models/user.model');
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');

// 16.5 https://www.npmjs.com/package/uuid
// import { v4 as uuidv4 } from 'uuid';        ES6
const { v4: uuidv4 } = require('uuid'); // CommonJS

// 16.6 
const { updateImage } = require('../helpers/update-image.helper');


// 16
const fileUpload = async(req, res = response) => {

    try {

        const type = req.params.type;
        const id = req.params.id;
        // Validar tipos (crear carpeta uploads y subcarpeta por tipo)
        const types = ['hospitals', 'doctors', 'users'];
        if (!types.includes(type)) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo no esta reconocido',
                err: `El tipo ${type} no está en la lista de permitidos: ${types}`
            });
        }
        // npm express-fileupload 
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha enviado un fichero en el payload',
                err: 'La propiedad image del payload form-data no existe o no se cargo con una imagen'
            });
        }

        let file = req.files.image; // image es el nombre de mi propiedad
        const shortName = file.name.split('.'); // nombre archivo : arreglo con todos los nombres
        const extension = shortName[shortName.length - 1];

        // Validar extensión .jpg , .png , jpeg , .gif
        const extensions = ['jpg', 'png', 'jpeg', 'gif'];
        if (!extensions.includes(extension)) {
            return res.status(400).json({
                ok: false,
                msg: 'La extensión no esta reconocida',
                err: `La extensión ${extension} no está en la lista de permitidas: ${extensions}`
            });
        }

        // Generar nombre || instlar uuid
        const fileId = uuidv4();
        const filename = `${fileId}.${extension}`;
        const path = `./uploads/${type}`;
        const pathfilename = `${path}/${filename}`;

        // Use the mv() method to place the file somewhere on your server
        file.mv(pathfilename, (error) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover imagen',
                    err: `El fichero no se pudo mover a ${pathfilename}. More: ${error}`
                });
            }

            // Actualizar bbdd
            updateImage(type, id, path, filename);

            res.status(200).json({
                ok: true,
                msg: 'Fichero subido',
                data: `El fichero se movio a ${pathfilename}`
            });

        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado subir contenido',
            err: error
        });
    }


}


// 17 - mostrar imagen
const getImagen = (req, res = response) => {

    const type = req.params.type;
    const photo = req.params.photo;

    // Paquete: path   -> hacer el require
    const pathNoImg = path.join(__dirname, `../uploads/no-img.jpg`);
    const pathImg = path.join(__dirname, `../uploads/${type}/${photo}`);

    // console.log('upload.controller.getImagen() pathImg=', pathImg);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(pathNoImg);
    }
    return;
}

module.exports = { fileUpload, getImagen }