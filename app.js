require("dotenv").config();
const bcrypt = require('bcryptjs')
require("./config/database").connect();
const express = require('express');
const User = require('./model/user');
const app = express();
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');

//middleware userd
app.use(express.json());
app.use(cookieParser());

//routesq
app.get("/home", auth, (req, res) => {
    console.log("hello world");
    res.status(200).send("Welcome 🙌 ");
})
app.post("/", (req, res) => {
    console.log("hi sir");
})

app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!(email && firstName && lastName && password)) res.status(400).send("fill all the details");
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User alredy exist");
        }
        encryptPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptPassword,
        });
        const token = jwt.sign(
            { user_id: newUser._id, email },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" }
        )
        newUser.token = token;
        res.status(201)
            .cookie("token", token, {
                httpOnly: true,
            })
            .send(newUser);
    }
    catch (err) {
        console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("All input required");
        }
        const newUser = await User.findOne({ email });

        if (newUser && (await bcrypt.compare(password, newUser.password))) {

            const token = jwt.sign(
                { user_id: newUser._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            newUser.token = token;
            res.status(200).json(newUser)
                .cookie("token", token,
                    {
                        httpOnly: true,
                    }
                );
        }
        else
            res.status(400).send("Invalid Credentials");

    }
    catch (err) {
        console.log(err);
    }
});
module.exports = app;
