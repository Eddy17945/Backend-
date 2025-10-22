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

export const getEjemplosById = async (req, res) => {
    console.log('obteniendo ejemplo por id');
    const { id } = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ msg: 'ID inválido' });
        }
        const ejemplo = await Ejemplo.findById(id);
        if(!ejemplo){
            return res.status(404).json({ msg: 'Ejemplo no encontrado' });
        }
        return res.status(200).json({ ejemplo });
    }
    catch (error) {
        return res.status(500).json({ msg: 'Error al obtener ejemplo por ID' });
    }
};



export const postEjemplo = async (req, res) => {
    console.log('post ejemplo');
    const body = req.body;
    const ejemplo = new Ejemplo(body);
    try {

        const validationError = ejemplo.validateSync();
        if ( validationError ) {
            const errorMessages = Object.values(validationError.errors).map(err => err.message);
            return res.status(400).json({ msg: 'Error de validación', errors: errorMessages });
        }
        await ejemplo.save();
        return  res.status(201).json({ mensaje: 'Ejemplo creado exitosamente', ejemplo });
    } catch (error) {
        return res.status(500).json({ msg: 'Error al crear ejemplo' });
    }
};


export const putEjemplo = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try{

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ msg: 'ID inválido' });
        }
        const ejemplo = await Ejemplo.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if(!ejemplo){
            return res.status(404).json({ msg: 'Ejemplo no encontrado' });
        }
        return res.status(200).json({ msg: 'Ejemplo actualizado exitosamente', ejemplo });
    }
    catch (error) {
        return res.status(500).json({ msg: 'Error al actualizar ejemplo' });
    }
};

export const deleteEjemplo = async (req, res) => {
    console.log('delete ejemplo');
    const { id } = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ msg: 'ID inválido' });
        }
        const ejemplo = await Ejemplo.findByIdAndDelete(id);
        if(!ejemplo){
            return res.status(404).json({ msg: 'Ejemplo no encontrado' });
        }
        return res.status(200).json({ msg: 'Ejemplo eliminado exitosamente', ejemplo });
    }
    catch (error) {
        return res.status(500).json({ msg: 'Error al eliminar ejemplo' });
    }
};