const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const booking = require('./routes/booking');
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("connection error: " + err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
app.use(booking);
app.listen(port, () => {
    console.log(`Example app listening at http://${process.env.IP}:${port}`);
});
