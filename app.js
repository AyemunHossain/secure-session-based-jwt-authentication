require("dotenv").config();
const express = require("express");
const cluster = require("cluster");
const app = express();
const totalCPUs = require("node:os").cpus().length;
const session = require("express-session");
const csrf = require("csurf");
const csrfProtect = csrf({ cookie: true });
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var parseForm = bodyParser.urlencoded({ extended: false });

const sessionConfig = session({
  secret: process.env.CSRFT_SESSION_SECRET,
  keys: ["some random key"],
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: parseInt(process.env.CSRFT_EXPIRESIN),
    sameSite: "strict",
    httpOnly: true,
    domain: process.env.DOMAIN,
    secure: false,
  },
});

app.use(cookieParser());
app.use(sessionConfig);

///Routes
const user = require("./controllers/user");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/setCSRFToken", csrfProtect, (req, res, next) => {
  const token = req.csrfToken();
  res.send({ csrfToken: token });
});

app.post("/api/checkCSRFToken", parseForm, csrfProtect, function (req, res) {
  res.send({ msg: "CSRF Token is valid." });
});

// // app.use(csrfProtect);
app.post("/api/login", user.login);
app.post("/api/logout", user.signout);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
