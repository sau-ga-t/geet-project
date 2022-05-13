const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { comparePassword, cryptPassword } = require('../utils/password_utils');
const { client } = require('../db/mongo');

router.use(bodyParser.json({ extended: true }));

router.post('/login', async (req, res) => {
    const requestBody = req.body;
    const userQuery = { userName: requestBody['username'] };
    var user = await client.db("users").collection("user").findOne(userQuery);
    if (!user) {
        res.send({
            status: false,
            message: "Username or password incorrect."
        });
    } else {

        const password = requestBody['password'];
        comparePassword(password, user['password'], (err, match) => {
            if (!err && match) {
                res.send({
                    status: true,
                    token: user['password'],
                });
            } else {
                res.send({
                    status: false,
                    message: "Username or password incorrect."
                });
            }
        })
    }
});

router.post('/signup', async (req, res) => {
    const requestBody = req.body;

    // Query to check if email or username already exists
    const emailQuery = { email: requestBody['email'] };
    const userQuery = { userName: requestBody['username'] };
    var userEmailExists = await client.db("users").collection("user").findOne(emailQuery);
    var userNameExists = await client.db("users").collection("user").findOne(userQuery);

    if (userEmailExists || userNameExists) {
        if (userEmailExists) {
            res.send({
                status: false,
                message: "Email already registered"
            });
        }
        else {
            res.send({
                status: false,
                message: "Username already in use"
            });
        }
    } else {
        console.log("User not found");

        const password = requestBody['password'];
        res.send(password);
        // cryptPassword(password,async (err,hash)=>{
        //     if(err){
        //         res.send(err);
        //     }else{
        //         const dataResponse = await client.db("users").collection("user").insertOne({
        //             userName:requestBody['username'],
        //             email:requestBody['email'],
        //             password:hash
        //         });
        //         res.send(dataResponse);
        //     }


        // });
    }




});

module.exports = router