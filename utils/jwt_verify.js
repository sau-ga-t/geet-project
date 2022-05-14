const jwt = require("jsonwebtoken");
const { client } = require('../db/mongo');

const config = process.env;


const invalid_message = {
    status:false,
    message: "Invalid token",
};

const verifyToken = async (req, res, next) => {
  const token =
   req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send(invalid_message);
  }
  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    var user = await client.db("users").collection("token").findOne({userId:decoded.user_id});
    if(token === user.token){
        req.user = decoded;
    }else{
        return res.status(401).send(invalid_message);
    }
  } catch (err) {
    return res.status(401).send(invalid_message);
  }
  return next();
};

module.exports = verifyToken;