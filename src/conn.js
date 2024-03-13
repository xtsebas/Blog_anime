import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'sebas',
    database: 'blog_sebas',
    password: '3570',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306,
});

export default pool;
