const mongoose = require('mongoose');


const blackListTokenSchema = new mongoose.Schema({
    token: {
        type :String,
        required :[true , "token is required to black list a token"],
    }
},{timestamps : true})

const blackListTokenModel = mongoose.model("blackListTokens" , blackListTokenSchema);

module.exports = blackListTokenModel;