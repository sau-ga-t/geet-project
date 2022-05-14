const express = require('express');
const verifyToken = require("../utils/jwt_verify");
const bodyParser = require('body-parser');

const req = require('express/lib/request');
const router = express.Router();

router.use(bodyParser.json({ extended: true }));

router.get('/',verifyToken, (req, res)=>{
    res.send({status:true, message:"Welcome "+req.user.username});
});


module.exports = router;