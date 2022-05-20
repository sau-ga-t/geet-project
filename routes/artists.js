const express = require('express');
const verifyToken = require("../utils/jwt_verify");
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json({ extended: true }));

router.get('/',verifyToken, (req, res)=>{
    res.send({status:true, message:"Artists: 200"});
});


module.exports = router;