var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//引入session模块
let session = require("express-session");
//引入上传模块
let multer = require("multer");
//配置上传对象
let upload = multer({ dest: "./public/upload" });
//session配置

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// 后台模块
var adminRouter = require("./routes/admin/adminRouter");
// 注册模块
var loginRouter = require("./routes/login/loginRouter");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//配置session
app.use(
  session({
    secret: "xzsagjasoigjasoi",
    resave: true, //强制保存session
    cookie: {
      //maxAge:7*24*60*60*1000,//设置session的有效期为1周
    },
    saveUninitialized: true, //是否保存初始化的session
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 前台路由
app.use("/", indexRouter);

// 后台路由
app.use("/admin", adminRouter);

// 登录路由
app.use("/rl", loginRouter);

app.use("/users", usersRouter);

module.exports = app;
