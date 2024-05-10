//imports
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const userModel = require("./modules/user");
const todoModel = require("./modules/todo");
const KEY = "jwtisawesome";
0
//setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

//middlewares
async function isLoggedIn(req, res, next) {
  let token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
  }
  let user = jwt.verify(token, KEY);
  req.user = user;
  console.log(user);
  next();
}

//routes
app.get("/", (req, res) => {
  res.render("index", { msg: "" });
});

app.post("/createUser", async (req, res) => {
  let { username, email, password } = req.body;

  if (username != "" && email != "" && password != "") {
    let user = await userModel.findOne({ email });

    if (user) {
      return res.render("index", {
        user: null,
        msg: `User with email ${email}  already exists.`,
      });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        user = await userModel.create({
          username,
          email,
          password: hash,
        });
        let token = jwt.sign({ email, id: user._id }, KEY);
        res.cookie("token", token);
        res.redirect("/login");
      });
    });
  } else {
    res.redirect("/");
  }
});

app.get("/login", (req, res) => {
  res.render("login", { msg: "" });
});

app.post("/login", async (req, res) => {
  let { username, email, password } = req.body;
  let user = await userModel.findOne({ email });

  if (!user) {
    return res.render("login", {
      user: null,
      msg: `Incorrect email or password`,
    });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email, id: user._id }, KEY);
      res.cookie("token", token);
      res.redirect("/dashboard");
    } else {
      res.render("login", { user: null, msg: `Incorrect email or password` });
    }
  });
});

app.get("/dashboard", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ _id: req.user.id }).populate("todos");

  res.render("dashboard", { user: user });
});

app.post("/addTodo", isLoggedIn, async (req, res) => {
  let { title, desc } = req.body;
  let user = await userModel.findOne({ _id: req.user.id });
  let todo = await todoModel.create({
    user: user._id,
    title,
    desc,
    completed: false,
  });
  user.todos.push(todo._id);
  await user.save();
  res.redirect("dashboard");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/markasdone/:todo", async (req, res) => {
  let todo = await todoModel.findOne({ _id: req.params.todo });
  todo.completed = true;
  await todo.save();
  res.redirect("/dashboard");
});

app.get("/delete/:todo", async (req, res) => {
  let todo = await todoModel.findOne({ _id: req.params.todo });
  let user = await userModel.findOne({ _id: todo.user });
  user.todos.splice(user.todos.indexOf(todo._id), 1);
  await user.save();
  await todoModel.deleteOne({ _id: todo._id });
  res.redirect("/dashboard");
});

app.listen(3000, (err, res) => {
  console.log("listening");
});
