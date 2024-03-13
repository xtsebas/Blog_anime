import express from 'express';
import cors from 'cors';
import fs from 'fs';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { getAllPosts, getPostByID, createPost, deletePostByID, updatePostByID } from './db.js';

const app = express();
const port = 3000;

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

app.listen(port, () => {
    console.log(`Server listening at http://127.0.0.1:${port}`);
});
