const {MongoClient} = require('mongodb');
require('dotenv').config();

const uri = process.env.ATLAS_URI ;


const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectDb = async ()=>{
    console.log("Connecting mongodb");
    try{
        await client.connect();
        console.log("Mongodb connected");

    }catch(err){
        console.log(err);
        process.exit(1);
    }
    client.connect()
}

module.exports = {connectDb, client};
