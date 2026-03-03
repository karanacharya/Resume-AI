require("dotenv").config();
const connectToDB = require('./src/config/db')
const app = require("./src/app");

connectToDB();


app.listen(3000, function(req, res){
     console.log("Server is running on port 3000")
})