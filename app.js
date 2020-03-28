const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Import routes
const authRoute = require('./routes/auth');

// Setup cors options
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

// Connect to DB
mongoose
  .connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.log(error));

// Setup middleware
app.use(express.json());
app.use(cors(corsOptions));

// Route middlewares
app.use('/api/users', authRoute);

app.listen(process.env.PORT, () => console.log(`Started server on port ${process.env.PORT}`));
