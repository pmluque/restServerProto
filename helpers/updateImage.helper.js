// Subir ficheros
const fs = require('fs');
// Modelos
const Doctor = require("../models/doctor.model");
const Hospital = require('../models/hospital.model');
const User = require('../models/user.model');

const deleteImage = (path) => {

    if (fs.existsSync(path)) {
        //borra
        fs.unlinkSync(path);
    }
}

const updateImage = async(type, id, path, filename) => {

    let pathOld = '';

    switch (type) {
        case 'users':
            const user = await User.findById(id);
            if (!user) {
                return false;
            }

            pathOld = `./uploads/users/${ user.img}`;
            deleteImage(pathOld);

            user.img = `${path}/${filename}`;
            await user.save();
            return true;

            break;

        case 'doctors':
            const doctor = await Doctor.findById(id);
            if (!doctor) {
                return false;
            }

            pathOld = `./uploads/doctors/${ doctor.img}`;
            deleteImage(pathOld);

            doctor.img = `${path}/${filename}`;
            await doctor.save();
            return true;

            break;

        case 'hospitals':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                return false;
            }

            pathOld = `./uploads/hospitals/${ hospital.img}`;
            deleteImage(pathOld);

            hospital.img = `${path}/${filename}`;
            await hospital.save();
            return true;

            break;
    }
}

module.exports = {
    updateImage
}