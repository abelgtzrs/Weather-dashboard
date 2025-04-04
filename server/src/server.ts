import dotenv from 'dotenv';
import express from 'express';
import htmlRoutes from './routes/htmlRoutes.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import weatherRoutes from './routes/api/weatherRoutes.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('🔍 Serving static files from:', join(__dirname, '../client/dist'));

// 1. MIDDLEWARE FOR PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve static files
app.use(express.static(join(__dirname, '../../client/dist')));


// 3. Then mount the weatherRoutes
app.use('/api/weather', weatherRoutes);

// 4. Then your other routes
app.use(routes);
app.use('/', htmlRoutes);

// Finally, start the server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
