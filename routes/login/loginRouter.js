var express = require("express");
var router = express.Router();
// 加密方法
var jiami = require("../../module/jiami");

var sqlQuery = require("../../module/wqyMysql");

/* GET users listing. */
router.get("/register", function (req, res, next) {
  res.render("login/register.ejs");
});

router.get("/login", function (req, res, next) {
  res.render("login/login.ejs");
});

// 处理注册提交post请求
router.post("/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  // 判断用户是否存在
  let sqlStr = "select * from user where username = ?";
  let result = await sqlQuery(sqlStr, [username]);
  if (result.length != 0) {
    // 注册失败
    res.render("info/info", {
      title: "注册失败",
      content: "用户已存在",
      href: "/rl/register",
      hrefTxt: "注册页",
    });
  } else {
    // 注册成功
    sqlStr = "insert into user (username,password,roleid) values (?,?,1)";
    await sqlQuery(sqlStr, [username, jiami(password)]);
    res.render("info/info", {
      title: "注册成功",
      content: "注册成功，即将进入登录页",
      href: "/rl/login",
      hrefTxt: "登录页",
    });
  }
});

// 处理登录提交post请求
router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let sqlStr = "select * from user where username = ? and password = ?";
  let result = await sqlQuery(sqlStr, [username, jiami(password)]);
  if (result.length == 0) {
    // 登录失败
    res.render("info/info", {
      title: "登录失败",
      content: "用户名或密码错误",
      href: "/rl/login",
      hrefTxt: "登录页",
    });
  } else {
    // 登录成功
    // 设置session
    req.session.username = username;
    res.render("info/info", {
      title: "登录成功",
      content: "跳转至后台页面",
      href: "/admin",
      hrefTxt: "后台页面",
    });
  }
});

// 退出登录
router.get("/loginout", (req, res) => {
  req.session.destroy();
  res.render("info/info", {
    title: "退出登录成功",
    content: "立即跳转登录界面",
    href: "/rl/login",
    hrefTxt: "登录页",
  });
});

module.exports = router;
