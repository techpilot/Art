const express = require("express")
const artRouter = require("./routes/artRoutes")
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes")
const cookieParser = require("cookie-parser");

const app = express()

// Body parser, reading data from the body into req.body
app.use(express.json());
app.use(express.static(`${__dirname}/public`))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next()
})

//Routes
app.use("/arts", artRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewRouter);

module.exports =  app;