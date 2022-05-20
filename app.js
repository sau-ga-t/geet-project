const express = require('express');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const artists = require('./routes/artists');
const albums = require('./routes/albums');
const {connectDb} = require('./db/mongo');
require('dotenv').config();

//Connecting to mongodb database
connectDb();

//Initialize a new express app
app = express();
const port = process.env.PORT;

app.get('/', (req, res)=>{
    res.json({
        message:"Welcome to geet. A music streaming site",
        authentication: "/auth",
        profile:"/profile",
    });
});

app.use('/auth', auth);
app.use('/profile', profile);
app.use('/artists', artists);
app.use('/albums', albums);

app.listen(port, ()=>{
    console.log(`Running on port ${port}`)
});


