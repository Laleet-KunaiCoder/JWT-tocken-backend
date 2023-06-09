require("dotenv").config();
const bcrypt = require('bcryptjs')
require("./config/database").connect();
const express = require('express');
const User = require('./model/user');
const app = express();

//here i fu*k the ()
app.use(express.json());

app.get("/", (req, res) => {
    console.log("hello world");
    res.send("hi");
 })
 app.post("/",(req,res)=>{
    console.log("hi");
 })
app.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!(email && first_name && last_name && password)) res.status(400).send("fill all the details");
        const oldUser = await User.findOnd({ email });
        if (oldUser) {
            return res.status(409).send("User alredy exist");
        }
        encryptPassword = await bcrypt.hash(password, 10);
        const user = await create.User({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptPassword,
        });
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" }
        )
        user.token = token;
        res.status(201).json(user);
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
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {

            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");

    }
    catch (err) {
        console.log(err);
    }
});
module.exports = app;
