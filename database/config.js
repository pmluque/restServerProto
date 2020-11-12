const mongoose = require('mongoose');

const dbConnection = async() => {
    // mongodb+srv://scmongo:<password>@cluster0.jqetk.mongodb.net/test
    // mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB connected!');

    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión a base de datos !');
    }
}

module.exports = {
    dbConnection
}