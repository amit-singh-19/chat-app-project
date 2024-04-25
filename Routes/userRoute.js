const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");
const session = require("express-session");
const dotenv = require("dotenv").config();
const auth = require("../middlewares/auth");

const user_route = express();
const { SESSION_SECRET } = process.env;

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

user_route.set("view engine", "ejs");
user_route.set("views", "./views");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({
  storage: storage,
});

user_route.get("/register", auth.isLogout, userController.registerLoad);
user_route.post("/register", upload.single("image"), userController.register);
user_route.get("/", auth.isLogout, userController.loadLogin);
user_route.post("/", userController.login);
user_route.get("/logout", auth.isLogin, userController.logout);
user_route.get("/dashboard", auth.isLogin, userController.loadDashboard);
user_route.post('/save-chat', userController.saveChat);
user_route.post('/delete-chat', userController.deleteChat);
user_route.post('/update-chat', userController.updateChat);

user_route.get("*", function (req, res) {
  res.redirect("/");
});


module.exports = user_route;
