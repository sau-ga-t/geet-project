const express = require('express');
const verifyToken = require("../utils/jwt_verify");
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json({ extended: true }));

router.get('/',verifyToken, (req, res)=>{
    res.send({status:true, message:"Albums: 299"});
});

router.post('/',verifyToken, (req, res)=>{
    res.send({
        status:true,
        message:"Album added successfully.",
        album:req.body,
    });
});


module.exports = router;