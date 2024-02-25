import conn from './conn.js'

export async function getAllPosts() {
 const [rows] = await conn.query('SELECT * FROM anime')
    return rows
}

export async function createPost(title, content) {
    const [result] = await db.query('INSERT INTO anime (title, content) VALUES (?, ?)', [title, content])
    return result
}