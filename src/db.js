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

async function getUser(username, password) {
    // Ejecutar consulta SQL para seleccionar un usuario específico por su nombre de usuario y verificar la contraseña
    const [rows] = await conn.query('SELECT usuario, password FROM user WHERE usuario = ? AND password = ?', [username, password]);
    // Si se encuentra el usuario en la base de datos
    if (rows.length > 0) {
        // Devolver los datos del usuario
        return rows[0];
    }
    // Si no se encuentra el usuario o la contraseña no coincide, devolver null
    return null;
}


async function registerUser(username, password) {
    try {
        // Ejecutar consulta SQL para insertar un nuevo usuario en la tabla anime
        const [result] = await conn.query('INSERT INTO user (usuario, password) VALUES (?, ?)', [username, password]);

        // Si la inserción es exitosa, devolver el ID del nuevo usuario insertado
        return result.insertId;
    } catch (error) {
        // Si ocurre algún error durante la inserción, devolver null
        return null;
    }
}

async function getAllUser() {
    // Ejecutar consulta SQL para seleccionar todos los registros en la tabla anime
    const [rows] = await conn.query('SELECT * FROM user');
    return rows;
}


// Exportar las funciones para que puedan ser utilizadas en otros módulos
export { getAllPosts, getPostByID, createPost, deletePostByID, updatePostByID, getUser, registerUser, getAllUser };