const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: './config.env' });
const app = require("./app");
const {connections} = require("mongoose");

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }, () => console.log("CONNECTION SUCCESSFUL"))


// Connecting to the server
app.listen(process.env.PORT, () => {
  console.log(`app running on ${process.env.PORT}`)
})