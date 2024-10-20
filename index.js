const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

const userRoutes = require('./routes/userRoutes');
const pengelolaRoutes = require('./routes/pengelolaRoutes');

const app = express();

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/user', userRoutes);
app.use('/pengelola', pengelolaRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bank-sampah', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
