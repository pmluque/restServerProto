require('dotenv').config(); // 4.2 - Cargar propiedades de configuración
const express = require('express'); // 1
// const bodyParser = require('body-parser'); // 8.4  || esto produjo errores en los métodos !!!! -- regreso a express
const cors = require('cors'); // 5.1
const { dbConnection } = require('./database/config'); // 3.5 | Las llaves es por la desestructuración por si me quiero traer más de un objeto del fichero

// 1.4 Crear servidor
const app = express();
// 5.1
app.use(cors()); // use activa middleware o funciones | siempre que se hace una petición se activa
// 8.4 :  --- antes de las rutas ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// 3.5 Invocar función de conexión
dbConnection();
// Importar fichero de rutas - cargar mi middleware
app.use('/api/users', require('./routes/user.routes'));
// 11. - servicios para login
app.use('/api/login', require('./routes/auth.routes'));
// 15.2 
app.use('/api/hospitals', require('./routes/hospital.routes')); // Nueva ruta para hospitales
app.use('/api/doctors', require('./routes/doctor.routes')); // Nueva ruta para doctores
// 15.8
app.use('/api/search', require('./routes/search.routes')); // Endpoint de búsqueda global
// 16.1
app.use('/api/upload', require('./routes/upload.routes')); // Endpoint de subidas de ficheros

// 2.1 Rutas
app.get('/', (req, res) => {
    res.status(200).json({ ok: true, msg: 'Welcome !' });
});
app.get('/error', (req, res) => {
    res.status(400).json({ ok: false, msg: 'Error !' });
});
/* Movelo al fichero de rutas
app.get('/api/users', (req, res) => {
    res.status(400).json({ ok: true, msg: 'Error !' });
});
*/


// 1.4 Lanzar servidor
app.listen(process.env.PORT, () => {
    console.log('Restserver started on ' + process.env.PORT);
});