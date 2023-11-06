require('dotenv').config()
const express = require("express");
const cookieparser = require('cookie-parser')
const fileUpload = require("express-fileupload");
const web = require("./routes/web");
const connectDb = require("./db/connectDb");
const app = express();
const port = 3000;

let session = require('express-session')
let flash = require('connect-flash');

app.set("view engine", "ejs"); // FOR HTML & CSS

connectDb(); // FOR CONNECT WITH MONGODB

app.use(cookieparser()) // FOR SAVE COOKIES

app.use(fileUpload({useTempFiles: true})); // FOR FILE UPLOAD

app.use(express.static("public")); // FOR PUBLIC FOLDER

app.use(session({
  secret: 'secret',
  cookie: {maxAge:60000},
  resave: false,
  saveUninitialized: false,

}));

app.use(flash()); // FOR FLASH MESSAGES

// DATA GET
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));

// ROUTER LOAD
app.use("/", web);

app.listen(port, () => {
  console.log(`App Listen on http://localhost:${port}`);
});
