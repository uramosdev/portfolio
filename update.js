// update.js
import Database from 'better-sqlite3';
const db = new Database('database.sqlite');

const nuevaImagen = 'code.jpg'; // <-- El nombre de tu archivo
const slugDelPost = 'future-of-web-dev'; // <-- El post que quieres cambiar

const result = db.prepare('UPDATE blog_posts SET cover_image = ? WHERE slug = ?')
                 .run(nuevaImagen, slugDelPost);

if (result.changes > 0) {
    console.log("✅ ¡Imagen actualizada con éxito!");
} else {
    console.log("❌ No se encontró ningún post con ese slug.");
}