import Server from "./server/server.js";
import colors from 'colors';
import dotenv from 'dotenv';
dotenv.config();

const server = new Server();
server.listen();

console.log('Amo el cafe');

// index.js Punto de entrada de la aplicacion