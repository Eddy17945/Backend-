import mongoose from "mongoose";

const libroSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    autor: { 
        type: String, 
        required: [true, 'El autor es obligatorio'],
        trim: true
    },
    isbn: { 
        type: String, 
        required: [true, 'El ISBN es obligatorio'],
        unique: true,
        trim: true
    },
    editorial: { 
        type: String, 
        required: false,
        trim: true
    },
    anioPublicacion: { 
        type: Number, 
        required: [true, 'El año de publicación es obligatorio'],
        min: [1000, 'El año debe ser mayor a 1000'],
        max: [new Date().getFullYear(), 'El año no puede ser futuro']
    },
    genero: { 
        type: String, 
        required: [true, 'El género es obligatorio'],
        enum: ['Ficción', 'No Ficción', 'Ciencia', 'Historia', 'Biografía', 'Tecnología', 'Arte', 'Otro']
    },
    copias: {
        total: { type: Number, default: 1, min: 0 },
        disponibles: { type: Number, default: 1, min: 0 }
    },
    estado: {
        type: String,
        enum: ['Disponible', 'Prestado', 'En reparación', 'Perdido'],
        default: 'Disponible'
    }
}, {
    timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Validación personalizada: las copias disponibles no pueden ser mayores que el total
libroSchema.pre('save', function(next) {
    if (this.copias.disponibles > this.copias.total) {
        next(new Error('Las copias disponibles no pueden ser mayores que el total'));
    }
    next();
});

const Libro = mongoose.model("Libro", libroSchema);

export default Libro;