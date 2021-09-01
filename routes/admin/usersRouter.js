var express = require("express");
var fs = require("fs");
//引入上传模块
let multer = require("multer");
//配置上传对象
let upload = multer({ dest: "./public/upload" });
var router = express.Router();
var sqlQuery = require("../../module/wqyMysql");
var jiami = require("../../module/jiami");
var rename = require("../../module/rename");
//引入userlist路由
var userListRouter = require("./users/userListRouter");
var userListRouter2 = require("./users/userListRouter2");

var authListRouter = require("./users/authListRouter");

var roleListRouter = require("./users/roleListRouter");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("用户管理");
});

//个人信息路由
router.get("/selfinfo", async (req, res) => {
  //获取用户名
  let username = req.session.username;
  //通过用户名查找所有的信息
  let sqlStr = "select * from user where username = ?";
  let result = await sqlQuery(sqlStr, [username]);
  let users = result[0];
  //通过角色表获取所有角色
  let roles = await getRoles();
  let options = { users, roles };
  res.render("admin/users/selfinfo", options);
});

router.post("/selfimgupload", upload.single("imgfile"), async (req, res) => {
  let username = req.session.username;
  let result = rename(req);
  //将改名后的结果，上传到数据库
  let strSql = "update user set imgheader = ? where username = ?";
  await sqlQuery(strSql, [result.imgUrl, username]);
  res.json(result);
});

async function getRoles() {
  let sqlStr = "select * from role";
  let result = await sqlQuery(sqlStr);
  return Array.from(result);
}

router.post("/selfinfo", async (req, res) => {
  console.log(req.body);
  //更新数据
  let password = jiami(req.body.password);
  let email = req.body.email;
  let mobile = req.body.mobile;
  let roleid = req.body.roleid;
  let username = req.body.username;
  let sqlStr =
    "update user set password=?,email=?,mobile=?,roleid=? where username =?";
  let arr = [password, email, mobile, roleid, username];
  await sqlQuery(sqlStr, arr);
  res.json({
    state: "ok",
    content: "个人信息更新成功",
  });
});

router.use("/userlist1", userListRouter);

router.use("/userlist2", userListRouter2);

router.use("/authlist", authListRouter);

router.use("/rolelist", roleListRouter);

module.exports = router;
