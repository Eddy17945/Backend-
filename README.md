📚 Sistema de Gestión de Biblioteca
Sistema web completo para la gestión de una biblioteca, desarrollado con Node.js, Express, MongoDB y frontend vanilla (HTML/CSS/JavaScript).
📋 Descripción
Aplicación web que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre un catálogo de libros. Incluye funcionalidades de búsqueda por autor, filtrado por disponibilidad y gestión completa del inventario.
🚀 Características

✅ CRUD completo de libros
🔍 Búsqueda de libros por autor
📖 Filtrado de libros disponibles
📊 Control de copias totales y disponibles
🎨 Interfaz intuitiva y responsiva
⚡ API RESTful con Express
🗄️ Base de datos MongoDB Atlas

🛠️ Tecnologías Utilizadas
Backend

Node.js
Express.js
MongoDB / Mongoose
CORS
dotenv
colors (para logs en consola)

Frontend

HTML5
CSS3
JavaScript Vanilla (ES6+)
Fetch API con async/await


⚙️ Instalación y Configuración
Prerrequisitos

Node.js (v14 o superior)
npm (v6 o superior)
Cuenta en MongoDB Atlas (o MongoDB local)

Pasos de Instalación

Tener instalado tambien node.js para el servidor

Clonar el repositorio

git clone <https://github.com/Eddy17945/Backend-.git>
cd MRAPI

Instalar dependencias

npm install

Configurar variables de entorno

Crear un archivo .env en la raíz del proyecto con:
envMONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/basedatos
PORT=3000

{
  "titulo": "El Quijote",
  "autor": "Miguel de Cervantes",
  "isbn": "978-8423972804",
  "editorial": "Espasa",
  "anioPublicacion": 1605,
  "genero": "Ficción",
  "copias": {
    "total": 10,
    "disponibles": 8
  },
  "estado": "Disponible"
}

Rutas Disponibles
MétodoEndpointDescripciónGET/Obtener todos los librosGET/:idObtener un libro por IDGET/autor/:autorBuscar libros por autorGET/disponiblesObtener libros disponiblesPOST/Crear un nuevo libroPUT/:idActualizar un libro existenteDELETE/:idEliminar un libro

👨‍💻 Autor
[Bastidas Miranda Eddy Alexis]

Proyecto de Examen Parcial Api personalizada de una libreria 
