var express = require("express");
var router = express.Router();
//引入上传模块
let multer = require("multer");
const jiami = require("../../../module/jiami");
const rename = require("../../../module/rename");
//配置上传对象
let upload = multer({ dest: "./public/upload" });
var sqlQuery = require("../../../module/wqyMysql");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/users/userlist2");
});

router.get("/api/userlist", async (req, res) => {
  let page = parseInt(req.query.page);
  let limitNum = parseInt(req.query.limit);
  let sqlStr =
    "select `user`.id,`user`.username,`user`.email,`user`.mobile,`user`.imgheader,`user`.roleid,role.rolename " +
    "from user LEFT JOIN role " +
    "on `user`.roleid = role.id " +
    "limit ?,?";
  let arr = [(page - 1) * limitNum, limitNum];
  let result = await sqlQuery(sqlStr, arr);
  //获取user的综上述
  let sqlStr1 = "select count(id) as usersnum  from user";
  let result1 = await sqlQuery(sqlStr1);
  let count = result1[0].usersnum;
  let options = {
    code: 0,
    msg: "",
    count: count,
    data: Array.from(result),
  };
  res.json(options);
});

router.get("/edituser", async (req, res) => {
  let userid = req.query.id;
  let sqlStr = "select * from user where id = ?";
  let result = await sqlQuery(sqlStr, [userid]);
  let users = result[0];
  // 通过id来获取所有的角色
  let roles = await getRoles(0);
  let options = { users, roles };
  res.render("admin/users/userinfo", options);
});

// 修改头像
router.post("/selfimgupload", upload.single("imgfile"), async (req, res) => {
  let username = req.query.username;
  let result = rename(req);

  // 将改名的结果，上传到数据库中
  let sqlStr = "update user set imgheader = ? where username = ?";
  await sqlQuery(sqlStr, [result.imgUrl, username]);
  res.json(result);
});

// 修改信息
router.post("/userinfo", async (req, res) => {
  let username = req.body.username;
  let password = jiami(req.body.password);
  let mobile = req.body.mobile;
  let email = req.body.email;
  let roleid = req.body.roleid;
  let sqlStr =
    "update user set password = ?, email = ?, mobile = ?,roleid = ? where username = ?";
  let arr = [password, email, mobile, roleid, username];
  await sqlQuery(sqlStr, arr);
  res.json({
    state: "ok",
    content: "个人信息修改成功！",
  });
});

// 用户页面
router.get("/adduser", async (req, res) => {
  let roles = await getRoles(0);
  let options = { roles };
  res.render("admin/users/adduser", options);
});

// 增加用户
router.post("/adduser", async (req, res) => {
  let username = req.body.username;
  let password = jiami(req.body.password);
  let mobile = req.body.mobile;
  let email = req.body.email;
  let roleid = req.body.roleid;
  let imgheader = req.body.imgheader;

  // 判断用户是否存在
  let sqlStr1 = "select * from user where username = ?";
  let result1 = await sqlQuery(sqlStr1, [username]);
  if (result1.length == 0) {
    let sqlStr =
      "insert into user (username,password,email,mobile,roleid,imgheader) values (?,?,?,?,?,?)";
    let arr = [username, password, email, mobile, roleid, imgheader];
    await sqlQuery(sqlStr, arr);
    res.json({
      state: "ok",
      content: "添加成功！",
    });
  } else {
    res.json({
      state: "fail",
      content: "添加失败！",
    });
  }
});

// 增加头像
router.post("/addimgupload", upload.single("imgfile"), async (req, res) => {
  let username = req.query.username;
  let result = rename(req);
  res.json(result);
});

// 删除用户
router.get("/deluser", async (req, res) => {
  let userid = req.query.userid;
  let sqlStr = "delete from user where id = ?";
  let result = await sqlQuery(sqlStr, [userid]);
  res.json({
    state: "ok",
    content: Array.from(result),
  });
});

// 角色表
async function getRoles() {
  let sqlStr = "select * from role";
  let result = await sqlQuery(sqlStr);
  return Array.from(result);
}

module.exports = router;
