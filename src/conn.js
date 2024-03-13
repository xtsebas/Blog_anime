import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'xtsebas',
    database: 'blog_db',
    password: '123456789',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306,
});

export default pool;
