import express from 'express';
import routes from './routes/index';
import cors from 'cors';
import bodyParser from 'body-parser';


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse the raw body for webhook verification
app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

// Middleware
app.use(cors());
app.use(express.json());

// Use the routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

