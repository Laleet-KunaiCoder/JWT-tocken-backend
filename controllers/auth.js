require('dotenv').config();
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(email && firstName && lastName && password)) res.status(400).send('fill all the details');
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send('User already exist');
    }
    encryptPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptPassword,
    });
    const token = jwt.sign({ user_id: newUser._id, email }, process.env.TOKEN_KEY, { expiresIn: '2h' });
    newUser.token = token;
    res
      .status(201)
      .cookie('token', token, {
        htttpOnly: true,
      })
      .send(newUser);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send('please enter all inputs');
    }
    const currUser = await User.findOne({ email });
    if (currUser && (await bcrypt.compare(password, currUser.password))) {
      const token = jwt.sign({ user_id: currUser._id, email }, process.env.TOKEN_KEY, {
        expiresIn: '2h',
      });
      currUser.token = token;
      res
        .status(200)
        .cookie('token', token, {
          httpOnly: true,
        })
        .json(currUser);
    } else res.status(400).send('Invalid Credentials');
  } catch (err) {
    res.status(400);
    console.log(err);
  }
};
const getall = async (req, res) => {
  console.log(req.body);
  const all = await User.find();
  res.json(all);
};

module.exports = {
  register,
  login,
  getall,
};
