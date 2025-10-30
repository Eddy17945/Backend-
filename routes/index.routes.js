//import ejemploRouter from "./ejemplo.router.js";
//import { Router } from "express";
 //const indexRouter = Router();

//indexRouter.use('/ejemplo', ejemploRouter);


//export default indexRouter;


import ejemploRouter from "./ejemplo.router.js";
import libroRouter from "./libro.router.js";
import { Router } from "express";

const indexRouter = Router();

// Rutas
indexRouter.use('/ejemplo', ejemploRouter);
indexRouter.use('/libros', libroRouter);

export default indexRouter;