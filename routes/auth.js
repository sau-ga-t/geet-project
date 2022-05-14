const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { comparePassword, cryptPassword } = require('../utils/password_utils');
const { client } = require('../db/mongo');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config();


const privateKey = process.env.SECRET_KEY;
router.use(bodyParser.json({ extended: true }));

const validate = validations => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};


router.post('/login',
    validate([
        body('password').isLength({ min: 5 }),
        body('username').isLength({ min: 5 }),
    ]),
    async (req, res) => {
        const requestBody = req.body;
        const userQuery = { userName: requestBody.username };
        var userDb = await client.db("users").collection("user").findOne(userQuery);
        if (!userDb) {
            res.send({
                status: false,
                message: "Username or password incorrect."
            });
        } else {

            const password = requestBody.password;
            comparePassword(password, userDb.password, (err, match) => {
                if (!err && match) {
                    jwt.sign({ username: userDb.userName, user_id: userDb._id.toString() }, privateKey, {
                        expiresIn: "1h",
                    }, async function (error, token) {
                        if (!error) {
                            const filter = { userId: userDb._id.toString() }
                            const update = {
                                $set: {
                                    userId: userDb._id.toString(),
                                    token: token,
                                }
                            }
                            const options = { upsert: true };
                            await client.db("users").collection("token").updateOne(
                                filter, update, options
                            );
                            res.send({
                                status: true,
                                token: token,
                            });
                        } else {
                            res.send({
                                status: false,
                                message: error.message
                            });
                        }

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

router.post('/signup',
    body('email').normalizeEmail().isEmail(),
    validate([
        body('password').isLength({ min: 5 }),
        body('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        body('username').isLength({ min: 5 }),
    ]),

    async (req, res) => {

        const requestBody = req.body;

        // Query to check if email or username already exists
        const emailQuery = { email: requestBody.email };
        const userQuery = { userName: requestBody.username };
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

            const password = requestBody.password;
           
            cryptPassword(password, async (err, hash) => {
                if (err) {
                    res.send(err);
                } else {
                    try {
                        const userDb = await client.db("users").collection("user").insertOne({
                            userName: requestBody.username,
                            email: requestBody.email,
                            password: hash
                        });
                       if(userDb){
                          
                        jwt.sign({ username: requestBody.username, user_id: userDb.insertedId.toString() }, privateKey, {
                            expiresIn: "1h",
                        }, async function (error, token) {
                            if (!error) {
                                const user = await client.db("users").collection("token").insertOne({
                                    userId: userDb.insertedId.toString(),
                                    token: token,
                                });
                                if (user) {
                                    res.send({
                                        status: true,
                                        message: "Signup Successful",
                                        token: token,
                                    });
                                }

                            } else {
                                res.send({
                                    status: false,
                                    message: error.message
                                });
                            }
                        });
                       }else{
                           res.send({
                               status:false,
                               message:"Unable to create user."
                           });
                       }

                    } catch (exc) {
                        res.send({
                            status:false,
                            message:exc.message
                        });
                    }
                }


            });
        }
    });



module.exports = router