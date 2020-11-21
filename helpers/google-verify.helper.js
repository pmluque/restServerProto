//
// https://console.developers.google.com/apis/credentials/oauthclient/972780077903-b82lscqo5vhp95s7k81lqmrqqvuhc47d.apps.googleusercontent.com?project=restserver-1590085644344
// FUENTE: https://developers.google.com/identity/sign-in/web/backend-auth
// Función de ayuda para validar token de google
//
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_Client_ID);

// Ej. original funciona estándar : async function googleVerify() {
// ----ejemplo de como se pasa a función de flecha    
const googleVerify = async(token) => {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_Client_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const { given_name, family_name, email, picture } = payload
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return { given_name, family_name, email, picture }; // <= RETORNO
}

module.exports = { googleVerify }; // hay que exportarla para poder usarla fuera.
// IR AL CONTROLADOR auth.controller.js para usar función.