require('dotenv').config();
const connectToDB = require('./src/config/db');
const app = require('./src/app');

connectToDB();
  

app.listen(process.env.PORT , function () {
  console.log(`Server is running on port ${process.env.PORT}`);
});