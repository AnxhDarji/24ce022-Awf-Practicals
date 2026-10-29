const mongoose = require('mongoose');

async function connectMongoDB(url){
    return mongoose.connect(url).then(() => {
        console.log("MongoDB Connected Succesfully!")
    }).catch((e) => {
        console.log("Error in MongoDB Connection: ", e);
    })
}

module.exports = connectMongoDB;
