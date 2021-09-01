var express = require("express");
var router = express.Router();

var usersRouter = require("./usersRouter");
var newsRouter = require("./newsRouter");
var doctorsRouter = require("./doctorsRouter");
var patientsRouter = require("./patientsRouter");

// 进入后台的中间件
function permisson(req, res, next) {
  if (req.session.username == undefined) {
    res.render("info/info", {
      title: "尚未登录",
      content: "请重新登录",
      href: "/rl/login",
      hrefTxt: "登录页",
    });
  } else {
    next();
  }
}

/* GET users listing. */
router.get("/", permisson, function (req, res, next) {
  res.render("admin/index", { username: req.session.username });
});

// 后台用户管理
router.use("/users", usersRouter);

// 后台新闻管理
router.use("/news", newsRouter);

// 后台医生管理
router.use("/doctors", doctorsRouter);

// 后台患者管理
router.use("/patients", patientsRouter);

module.exports = router;
