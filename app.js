const express = require('express');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const {connectDb} = require('./db/mongo');
require('dotenv').config();



connectDb();

app = express();
const port = process.env.PORT;

app.get('/', (req, res)=>{
    
   
});

app.use('/auth', auth);
app.use('/profile', profile);

app.listen(port, ()=>{
    console.log(`Running on port ${port}`)
});


