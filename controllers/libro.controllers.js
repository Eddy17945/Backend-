import Libro from "../models/libro.model.js";
import mongoose from "mongoose";
// controllers/libro.controllers.js para la logica de los endpoints de libros
// Obtener todos los libros
export const getLibros = async (req, res) => {
    console.log('Obteniendo todos los libros');
    try {
        const libros = await Libro.find({}, { __v: 0 });
        if (libros.length === 0) {
            return res.status(404).json({ msg: 'No hay libros registrados en la biblioteca' });
        }
        return res.status(200).json({ 
            total: libros.length,
            libros 
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error al obtener los libros' });
    }
};

// Obtener un libro por ID
export const getLibroById = async (req, res) => {
    console.log('Obteniendo libro por ID');
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }
        const libro = await Libro.findById(id, { __v: 0 });
        if (!libro) {
            return res.status(404).json({ msg: 'Libro no encontrado' });
        }
        return res.status(200).json({ libro });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error al obtener el libro por ID' });
    }
};

// Crear un nuevo libro
export const postLibro = async (req, res) => {
    console.log('Creando nuevo libro');
    const body = req.body;
    
    try {
        // Verificar si el ISBN ya existe
        const libroExistente = await Libro.findOne({ isbn: body.isbn });
        if (libroExistente) {
            return res.status(400).json({ msg: 'Ya existe un libro con ese ISBN' });
        }

        const libro = new Libro(body);

        // Validar antes de guardar
        const validationError = libro.validateSync();
        if (validationError) {
            const errorMessages = Object.values(validationError.errors).map(err => err.message);
            return res.status(400).json({ msg: 'Error de validación', errors: errorMessages });
        }

        await libro.save();
        return res.status(201).json({ 
            msg: 'Libro creado exitosamente', 
            libro 
        });
    } catch (error) {
        console.error('Error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ msg: 'El ISBN ya está registrado' });
        }
        return res.status(500).json({ msg: 'Error al crear el libro' });
    }
};

// Actualizar un libro
export const putLibro = async (req, res) => {
    console.log('Actualizando libro');
    const { id } = req.params;
    const body = req.body;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }

        // Si se está actualizando el ISBN, verificar que no exista en otro libro
        if (body.isbn) {
            const libroConISBN = await Libro.findOne({ isbn: body.isbn, _id: { $ne: id } });
            if (libroConISBN) {
                return res.status(400).json({ msg: 'Ya existe otro libro con ese ISBN' });
            }
        }

        const libro = await Libro.findByIdAndUpdate(
            id, 
            body, 
            { new: true, runValidators: true }
        );

        if (!libro) {
            return res.status(404).json({ msg: 'Libro no encontrado' });
        }

        return res.status(200).json({ 
            msg: 'Libro actualizado exitosamente', 
            libro 
        });
    } catch (error) {
        console.error('Error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ msg: 'El ISBN ya está registrado' });
        }
        return res.status(500).json({ msg: 'Error al actualizar el libro' });
    }
};

// Eliminar un libro
export const deleteLibro = async (req, res) => {
    console.log('Eliminando libro');
    const { id } = req.params;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }

        const libro = await Libro.findByIdAndDelete(id);
        
        if (!libro) {
            return res.status(404).json({ msg: 'Libro no encontrado' });
        }

        return res.status(200).json({ 
            msg: 'Libro eliminado exitosamente', 
            libro 
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error al eliminar el libro' });
    }
};

// Buscar libros por autor
export const getLibrosByAutor = async (req, res) => {
    console.log('Buscando libros por autor');
    const { autor } = req.params;
    
    try {
        const libros = await Libro.find({ 
            autor: new RegExp(autor, 'i') 
        }, { __v: 0 });

        if (libros.length === 0) {
            return res.status(404).json({ msg: `No se encontraron libros del autor: ${autor}` });
        }

        return res.status(200).json({ 
            total: libros.length,
            libros 
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error al buscar libros por autor' });
    }
};

// Obtener libros disponibles
export const getLibrosDisponibles = async (req, res) => {
    console.log('Obteniendo libros disponibles');
    
    try {
        const libros = await Libro.find({ 
            'copias.disponibles': { $gt: 0 },
            estado: 'Disponible'
        }, { __v: 0 });

        if (libros.length === 0) {
            return res.status(404).json({ msg: 'No hay libros disponibles en este momento' });
        }

        return res.status(200).json({ 
            total: libros.length,
            libros 
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error al obtener libros disponibles' });
    }
};