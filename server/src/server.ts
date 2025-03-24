import dotenv from 'dotenv';
import express from 'express';
import htmlRoutes from './routes/htmlRoutes.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODO: Serve static files of entire client dist folder
app.use(express.static(join(__dirname, '../../client/dist'))); //TElls server to send frontend files from the client/dist folder
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json()); //Allows the server to understand JSON format
app.use(express.urlencoded({ extended:true })); //Allows server to understand form data
// TODO: Implement middleware to connect the routes
app.use(routes); //Checks the instructions in routes to handle incoming requests
app.use('/', htmlRoutes); //Checks htmlRoutes to handle requests

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`)); //Initializes app and logs console
