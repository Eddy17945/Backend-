import mongoose from 'mongoose';
let isConnected = false; // Track the connection status
// Función para conectar a MongoDB
const conectarAMongoDB = async () => {
  if (isConnected) {
    console.log('Ya estás conectado a MongoDB'.green);
    return;
  } 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('Conectado a MongoDB'.green);
    } catch (error) {
        console.error('Error al conectar a MongoDB'.red, error);
    }
}

const db = mongoose.connection;


db.on('error', (error) => {
    isConnected = false;
    console.log('Error en la conexión de MongoDB'.red, error);
});

db.once('open', () => {
    isConnected = true;
});

db.on('disconnected', () => {
    isConnected = false;
    console.log('Desconectado de MongoDB'.yellow);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada'.yellow);
    process.exit(0);
});

export {conectarAMongoDB, isConnected};