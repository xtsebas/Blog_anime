import express from 'express';
import cors from 'cors';
import fs from 'fs';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { getAllPosts, getPostByID, createPost, deletePostByID, updatePostByID, getUser, registerUser, getAllUser } from './db.js';
import { generateToken } from './jwt.js'

const app = express();
const port = 22295;

app.use(express.json());

const swaggerDocument = YAML.load('./api-docs/swagger.yaml');

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${
    req.path
    } - Request Body: ${JSON.stringify(req.body)}\n`;
    fs.appendFile('log.txt', logEntry, (err) => {
        if (err) {
            console.error('Error logging request:', err);
        }
    });
    res.on('finish', () => {
        const responseLog = `${new Date().toISOString()} - ${req.method} ${
        req.path
        } - Response Status: ${res.statusCode}\n`;
        fs.appendFile('log.txt', responseLog, (err) => {
        if (err) {
            console.error('Error logging response:', err);
            }
        });
    });
    next();
});

app.get('/hello', async (req, res)=>{
    res.send('HELLO WELCOME')
})

//Todos los posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send('An error occurred while fetching the posts.');
    }
});

//Post por ID
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await getPostByID(req.params.id); // Se debe pasar req.params.id
        res.status(200).json(post);
    } catch (error) {
        res.status(500).send('An error occurred while fetching the post.');
    }
});

//crear un post
app.post('/posts', async (req, res) => {
    try {
        const { title, sinopsis, gender } = req.body;
        const post = await createPost(title, sinopsis, gender);
        res.status(200).json(post); 
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Eliminar un post
app.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deletePostByID(id);
        res.status(200).send(`Post with ID ${id} deleted successfully.`);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

//Actualizar un post
app.put('/posts/:id', async (req, res) => {
    try {
        const { title, sinopsis, gender } = req.body;
        const { id } = req.params;
        const result = await updatePostByID(title, sinopsis, gender, id); // Se debe pasar id al final
        res.status(200).json({ message: 'Post Updated Successfully!', result });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para obtener un usuario por nombre de usuario y contraseña
app.post('/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;
        console.log(usuario, password);
        const user = await getUser(usuario, password);
        console.log(user);
        if (user) {
            const USER = {
              username,
              password
            }
            const token = generateToken(USER);
            res.status(200);
            res.json({ "success": true, access_token: token })
            return
        } else {
            res.status(401).send('Usuario no encontrado o contraseña incorrecta');
        }
    } catch (error) {
        res.status(500).send('Error al intentar iniciar sesión');
    }
});

// Ruta para registrar un nuevo usuario
app.post('/registro', async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const userId = await registerUser(usuario, password);
        if (userId) {
            res.status(200).json({ message: 'Usuario registrado exitosamente', userId });
        } else {
            res.status(500).send('Error al registrar el usuario');
        }
    } catch (error) {
        res.status(500).send('Error al registrar el usuario');
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const posts = await getAllUser();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send('An error occurred while fetching the posts.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://127.0.0.1:${port}`);
});
