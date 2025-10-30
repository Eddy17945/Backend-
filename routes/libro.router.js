import { Router } from "express";
import { 
    getLibros, 
    getLibroById, 
    postLibro, 
    putLibro, 
    deleteLibro,
    getLibrosByAutor,
    getLibrosDisponibles
} from "../controllers/libro.controllers.js";

const libroRouter = Router();

// Rutas principales
libroRouter.get('/', getLibros);
libroRouter.get('/disponibles', getLibrosDisponibles);
libroRouter.get('/autor/:autor', getLibrosByAutor);
libroRouter.get('/:id', getLibroById);
libroRouter.post('/', postLibro);
libroRouter.put('/:id', putLibro);
libroRouter.delete('/:id', deleteLibro);

export default libroRouter;