require('dotenv').config(); // 4.2 - Cargar propiedades de configuración
const express = require('express'); // 1
const cors = require('cors'); // 5.1
const { dbConnection } = require('./database/config'); // 3.5 | Las llaves es por la desestructuración por si me quiero traer más de un objeto del fichero

// 1.4 Crear servidor
const app = express();
// 5.1
app.use(cors()); // use activa middleware o funciones | siempre que se hace una petición se activa

// 3.5 Invocar función de conexión
dbConnection();

// 2.1 Rutas
app.get('/', (req, res) => {
    res.status(200).json({ ok: true, msg: 'Welcome !' });
});
app.get('/error', (req, res) => {
    res.status(400).json({ ok: false, msg: 'Error !' });
});


// 1.4 Lanzar servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor arrando en puerto : ' + process.env.PORT);
});