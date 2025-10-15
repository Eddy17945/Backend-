import express from 'express';
import cors from 'cors';    
import indexRouter from '../routes/index.routes.js';
import * as db from '../db/cnn_mongodb.js';
export default class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.miapi='/api';
        this.middlewares();
        this.conectarDBMongo();
        this.routes();
    }

    async conectarDBMongo(){
        if(!db.isConnected){
            await db.conectarAMongoDB();
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
       // localhost:3000/api/ejemplo
       this.app.use(this.miapi, indexRouter);
    }
    
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', `${this.port}`.yellow);
        });
    }
}

// el resto de carpetas no se suben por que no tiene ningun codigo todavia 