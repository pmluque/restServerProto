const { Schema, model } = require('mongoose');
const HospitalSchema = Schema({

    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    } // usuario creador del hospital (ref equivalente al modelo)
}, { collection: 'hospitals' });
// esta seccion collection no es necesaria porque ya lo pone el en "s" 
// pero es por si queremos personalizar el nombre

// Se usa function y no => porque this cogería del exterior
HospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject(); // simplemente retiramos la versión
    return object; // retorno object si versión y con id renombrado.
})

module.exports = model('Hospital', HospitalSchema);
// SIGUIENTE PASO: las rutas - 1º en index.js  2º en fichero dedicado de rutas (hospital.routes)