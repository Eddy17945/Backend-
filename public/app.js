// URL base de la API
const API_URL = 'http://localhost:3000/api/libros';

// js/app.js Para la logica del frontend de la aplicacion de gestion de libros

// Variables globales
let editandoLibro = false;
let libroIdEliminar = null;
let seccionActual = 'menu';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('libroForm').addEventListener('submit', manejarSubmit);
});

// Sistema de navegación entre secciones
function abrirSeccion(seccion) {
    // Ocultar menú principal
    document.getElementById('menuPrincipal').style.display = 'none';
    
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('active');
    });
    
    seccionActual = seccion;
    
    // Mostrar la sección seleccionada
    switch(seccion) {
        case 'agregar':
            document.getElementById('seccionAgregar').classList.add('active');
            limpiarFormulario();
            break;
        case 'ver':
            document.getElementById('seccionVer').classList.add('active');
            obtenerLibrosSeccion('ver');
            break;
        case 'buscar':
            document.getElementById('seccionBuscar').classList.add('active');
            document.getElementById('searchAutor').value = '';
            document.getElementById('librosListBuscar').innerHTML = '';
            document.getElementById('totalLibrosBuscar').textContent = '0 resultados';
            break;
        case 'disponibles':
            document.getElementById('seccionDisponibles').classList.add('active');
            obtenerLibrosDisponiblesSeccion();
            break;
    }
}

// Volver al menú principal
function volverMenu() {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Mostrar menú principal
    document.getElementById('menuPrincipal').style.display = 'block';
    seccionActual = 'menu';
    
    // Limpiar formulario si estaba editando
    limpiarFormulario();
}

// Obtener libros para la sección "Ver"
async function obtenerLibrosSeccion(seccion) {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (response.ok) {
            mostrarLibrosEnSeccion(data.libros, 'Ver');
            document.getElementById('totalLibrosVer').textContent = `${data.total} libros`;
        } else {
            mostrarLibrosEnSeccion([], 'Ver');
            mostrarNotificacion(data.msg, 'info');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al conectar con el servidor', 'error');
    }
}

// Obtener libros disponibles
async function obtenerLibrosDisponiblesSeccion() {
    try {
        const response = await fetch(`${API_URL}/disponibles`);
        const data = await response.json();
        
        if (response.ok) {
            mostrarLibrosEnSeccion(data.libros, 'Disponibles');
            document.getElementById('totalLibrosDisponibles').textContent = `${data.total} disponibles`;
            mostrarNotificacion('Mostrando libros disponibles', 'success');
        } else {
            mostrarLibrosEnSeccion([], 'Disponibles');
            mostrarNotificacion(data.msg, 'info');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al obtener libros disponibles', 'error');
    }
}

// Buscar libros por autor
async function buscarPorAutor() {
    const autor = document.getElementById('searchAutor').value.trim();
    
    if (!autor) {
        mostrarNotificacion('Por favor ingresa un autor', 'info');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/autor/${encodeURIComponent(autor)}`);
        const data = await response.json();
        
        if (response.ok) {
            mostrarLibrosEnSeccion(data.libros, 'Buscar');
            document.getElementById('totalLibrosBuscar').textContent = `${data.total} resultados`;
            mostrarNotificacion(`Se encontraron ${data.total} libros`, 'success');
        } else {
            mostrarLibrosEnSeccion([], 'Buscar');
            mostrarNotificacion(data.msg, 'info');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al buscar libros', 'error');
    }
}

// Mostrar libros en la sección correspondiente
function mostrarLibrosEnSeccion(libros, seccion) {
    let contenedorId;
    
    switch(seccion) {
        case 'Ver':
            contenedorId = 'librosListVer';
            break;
        case 'Buscar':
            contenedorId = 'librosListBuscar';
            break;
        case 'Disponibles':
            contenedorId = 'librosListDisponibles';
            break;
    }
    
    const contenedor = document.getElementById(contenedorId);
    
    if (libros.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <h3>📚 No hay libros para mostrar</h3>
                <p>${seccion === 'Ver' ? 'Agrega tu primer libro usando el formulario' : 'No se encontraron resultados'}</p>
            </div>
        `;
        return;
    }
    
    contenedor.innerHTML = libros.map(libro => `
        <div class="libro-item">
            <div class="libro-header">
                <div class="libro-title">
                    <h3>${libro.titulo}</h3>
                    <p>👤 ${libro.autor}</p>
                </div>
                <div class="libro-actions">
                    <button class="btn btn-warning" onclick="cargarLibroParaEditar('${libro._id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger" onclick="confirmarEliminar('${libro._id}', '${libro.titulo}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
            
            <div class="libro-details">
                <div class="detail-item">
                    <span class="detail-label">📖 ISBN</span>
                    <span class="detail-value">${libro.isbn}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🏢 Editorial</span>
                    <span class="detail-value">${libro.editorial || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📅 Año</span>
                    <span class="detail-value">${libro.anioPublicacion}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🎭 Género</span>
                    <span class="detail-value">${libro.genero}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📚 Copias</span>
                    <span class="detail-value">${libro.copias.disponibles} / ${libro.copias.total}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🏷️ Estado</span>
                    <span class="detail-value">
                        <span class="estado-badge ${getEstadoClass(libro.estado)}">
                            ${libro.estado}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Obtener clase CSS según el estado
function getEstadoClass(estado) {
    const clases = {
        'Disponible': 'estado-disponible',
        'Prestado': 'estado-prestado',
        'En reparación': 'estado-reparacion',
        'Perdido': 'estado-perdido'
    };
    return clases[estado] || 'estado-disponible';
}

// Manejar submit del formulario (crear o actualizar)
async function manejarSubmit(e) {
    e.preventDefault();
    
    const libro = {
        titulo: document.getElementById('titulo').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        isbn: document.getElementById('isbn').value.trim(),
        editorial: document.getElementById('editorial').value.trim(),
        anioPublicacion: parseInt(document.getElementById('anioPublicacion').value),
        genero: document.getElementById('genero').value,
        copias: {
            total: parseInt(document.getElementById('copiasTotal').value),
            disponibles: parseInt(document.getElementById('copiasDisponibles').value)
        },
        estado: document.getElementById('estado').value
    };
    
    // Validación de copias
    if (libro.copias.disponibles > libro.copias.total) {
        mostrarNotificacion('Las copias disponibles no pueden ser mayores que el total', 'error');
        return;
    }
    
    if (editandoLibro) {
        await actualizarLibro(libro);
    } else {
        await crearLibro(libro);
    }
}

// Crear nuevo libro
async function crearLibro(libro) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(libro)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarNotificacion('✅ Libro creado exitosamente', 'success');
            limpiarFormulario();
            
            // Opcional: volver al menú o mostrar mensaje de éxito
            setTimeout(() => {
                volverMenu();
            }, 1500);
        } else {
            mostrarNotificacion(data.msg || 'Error al crear el libro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al crear el libro', 'error');
    }
}

// Cargar libro para editar
async function cargarLibroParaEditar(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        if (response.ok) {
            const libro = data.libro;
            
            // Cambiar a la sección de agregar
            abrirSeccion('agregar');
            
            // Llenar el formulario
            document.getElementById('libroId').value = libro._id;
            document.getElementById('titulo').value = libro.titulo;
            document.getElementById('autor').value = libro.autor;
            document.getElementById('isbn').value = libro.isbn;
            document.getElementById('editorial').value = libro.editorial || '';
            document.getElementById('anioPublicacion').value = libro.anioPublicacion;
            document.getElementById('genero').value = libro.genero;
            document.getElementById('copiasTotal').value = libro.copias.total;
            document.getElementById('copiasDisponibles').value = libro.copias.disponibles;
            document.getElementById('estado').value = libro.estado;
            
            // Cambiar modo a edición
            editandoLibro = true;
            document.querySelector('#seccionAgregar h2').textContent = '✏️ Editar Libro';
            document.getElementById('submitBtnText').textContent = 'Actualizar Libro';
            document.getElementById('cancelBtn').style.display = 'block';
            
            // Scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            mostrarNotificacion('Libro cargado para edición', 'info');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar el libro', 'error');
    }
}

// Actualizar libro
async function actualizarLibro(libro) {
    const id = document.getElementById('libroId').value;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(libro)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarNotificacion('✅ Libro actualizado exitosamente', 'success');
            limpiarFormulario();
            
            // Volver al menú después de actualizar
            setTimeout(() => {
                volverMenu();
            }, 1500);
        } else {
            mostrarNotificacion(data.msg || 'Error al actualizar el libro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al actualizar el libro', 'error');
    }
}

// Confirmar eliminación
function confirmarEliminar(id, titulo) {
    libroIdEliminar = id;
    document.getElementById('modal-message').textContent = `¿Deseas eliminar el libro "${titulo}"? Esta acción no se puede deshacer.`;
    document.getElementById('modal').classList.add('show');
    
    document.getElementById('confirmBtn').onclick = () => eliminarLibro(id);
}

// Eliminar libro
async function eliminarLibro(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarNotificacion('✅ Libro eliminado exitosamente', 'success');
            
            // Actualizar la vista actual
            if (seccionActual === 'ver') {
                obtenerLibrosSeccion('ver');
            } else if (seccionActual === 'disponibles') {
                obtenerLibrosDisponiblesSeccion();
            }
        } else {
            mostrarNotificacion(data.msg || 'Error al eliminar el libro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar el libro', 'error');
    } finally {
        cerrarModal();
    }
}

// Cancelar edición
function cancelarEdicion() {
    limpiarFormulario();
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('libroForm').reset();
    document.getElementById('libroId').value = '';
    editandoLibro = false;
    document.querySelector('#seccionAgregar h2').textContent = '➕ Agregar Nuevo Libro';
    document.getElementById('submitBtnText').textContent = 'Agregar Libro';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal').classList.remove('show');
    libroIdEliminar = null;
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo) {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification ${tipo}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3500);
}