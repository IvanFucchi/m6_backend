import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authorsRouter from './routes/authors.js';
import blogPostsRouter from './routes/blogPosts.js';



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/authors', authorsRouter);
app.use('/api/blogPosts', blogPostsRouter);

export default app;
// This code sets up an Express.js application with CORS and JSON parsing middleware.
// It also imports and uses a router for handling author-related API routes.
// The application is configured to use environment variables from a .env file.
// Finally, the app is exported for use in other parts of the application.
// The app is set to listen on a specified port, and the server is started.
// The app is ready to handle incoming requests and respond with appropriate data.
