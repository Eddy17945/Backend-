import ejemploRouter from "./ejemplo.router.js";
import { Router } from "express";
 const indexRouter = Router();

indexRouter.use('/ejemplo', ejemploRouter);


export default indexRouter;