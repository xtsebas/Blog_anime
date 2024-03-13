import conn from './conn.js';

async function getAllPosts() {
    // Ejecutar consulta SQL para seleccionar todos los registros en la tabla anime
    const [rows] = await conn.query('SELECT * FROM anime');
    return rows;
}

async function getPostByID(id) {
    // Ejecutar consulta SQL para seleccionar un post específico por ID
    const [rows] = await conn.query('SELECT * FROM anime WHERE id = ?', [id]);
    // Retorna el primer elemento si existe, de lo contrario null
    return rows.length > 0 ? rows[0] : null;
}

async function createPost(title, sinopsis, gender) {
    // Ejecutar consulta SQL para insertar un nuevo registro en la tabla anime
    const [result] = await conn.query(
        'INSERT INTO anime (title, sinopsis, gender) VALUES (?, ?, ?)',
        [title, sinopsis, gender]
    );
    return result;
}

async function deletePostByID(id) {
    // Ejecutar consulta SQL para eliminar un registro específico por ID
    const [result] = await conn.query('DELETE FROM anime WHERE id = ?', [id]);
    // Si no se afectaron filas, lanzar un error
    if (result.affectedRows === 0) {
        throw new Error(`Post with ID ${id} not found or already deleted.`);
    }
    return true;
}

async function updatePostByID(id, title, sinopsis, gender, created_at) {
    // Ejecutar consulta SQL para actualizar un registro específico por ID
    const [result] = await conn.query(
        'UPDATE anime SET title = ?, sinopsis = ?, gender = ?, created_at = ? WHERE id = ?',
        [title, sinopsis, gender, created_at, id]
    );
    return result;
}

// Exportar las funciones para que puedan ser utilizadas en otros módulos
export { getAllPosts, getPostByID, createPost, deletePostByID, updatePostByID };