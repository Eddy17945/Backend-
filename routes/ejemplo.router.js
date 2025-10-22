import { Router } from "express";

import { getEjemplos, getEjemplosById, postEjemplo, putEjemplo, deleteEjemplo } from "../controllers/ejemplo.controllers.js";
const ejemploRouter = Router();



ejemploRouter.get('/',getEjemplos );

ejemploRouter.get('/:id', getEjemplosById);


ejemploRouter.put('/:id', putEjemplo);

ejemploRouter.post('/',postEjemplo);

ejemploRouter.delete('/:id', deleteEjemplo);

export default ejemploRouter;