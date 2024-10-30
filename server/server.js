import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
// import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  "/webhook",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// Middleware
app.use(cors({
  origin: 'https://vc-collections.vercel.app',
  credentials: true,
}));
app.use(express.json());

// Use the routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

