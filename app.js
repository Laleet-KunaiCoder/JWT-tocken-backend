require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const app = express();
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const { register, login, getall } = require('./controllers/auth');
const cors = require('cors');
//middleware userd
app.use(express.json());
app.use(cookieParser());
app.use(cors());
//routesq
app.get('/', auth, (req, res) => {
  console.log('hello world');
  res.status(200).send('Welcome 🙌 ');
});

app.get('/:user/upload', (req, res) => {
  console.log('hi sir');
  res.send(req.params['user']);
});

app.get('/all', getall);

app.post('/register', register);
app.post('/login', login);
module.exports = app;
