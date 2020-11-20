const { Schema, model } = require('mongoose');
const DoctorSchema = Schema({

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
    },
    hospital: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    } // Se puede poner en [] y agregar más de un {} hospital si fuera una relación "n"
});

// Se usa function y no => porque this cogería del exterior
DoctorSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject(); // simplemente retiramos la versión
    return object; // retorno object si versión y con id renombrado.
})

module.exports = model('Doctor', DoctorSchema);
// SIGUIENTE PASO: las rutas - 1º en index.js  2º en fichero dedicado de rutas (doctor.routes)