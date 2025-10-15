import Ejemplo from "../models/ejemplo.model.js";
import mongoose from "mongoose";
import express from "express";

export const getEjemplos = async (req, res) => {
console.log('obteniendo ejemplos');
try {
    const ejemplos = await Ejemplo.find({},{__v:0});
    if(ejemplos.length === 0){
        return res.status(404).json({ msg: 'No hay ejemplos registrados' });
    }
    return res.status(200).json({ejemplos});
} 
catch (error) {
    res.status(500).json({ msg: 'Error al obtener ejemplos' });
}
};