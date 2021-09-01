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
  res.render("admin/users/rolelist");
});

router.get("/api/rolelist", async (req, res) => {
  let page = parseInt(req.query.page);
  let limitNum = parseInt(req.query.limit);
  let sqlStr = "select * from role limit ?,?";
  let arr = [(page - 1) * limitNum, limitNum];
  let result = await sqlQuery(sqlStr, arr);
  let sqlStr1 = "select count(id) as authnum  from role";
  let result1 = await sqlQuery(sqlStr1);
  let count = result1[0].authnum;
  let options = {
    code: 0,
    msg: "",
    count: count,
    data: Array.from(result),
  };
  res.json(options);
});

router.get("/addrole", async (req, res) => {
  res.render("admin/users/addrole");
});

router.post("/addrole", async (req, res) => {
  console.log(req.body);
  //1修改角色表
  //获取角色名称和角色简介
  let rolename = req.body.rolename;
  let brief = req.body.brief;
  //将内容插入
  let sqlStr = "insert into role (rolename,brief) values (?,?)";
  await sqlQuery(sqlStr, [rolename, brief]);

  //2修改角色与权限关系表
  //获取权限数组
  let authlist = req.body.authlist;
  authlist.forEach(async (item, i) => {
    let id = item.value;
    let sqlStr2 =
      "insert into role_auth (roleid,authid) values ((select id from role where rolename = ?),?)";
    await sqlQuery(sqlStr2, [rolename, id]);
  });
  res.json({
    state: "ok",
    content: "数据插入成功",
  });
});

module.exports = router;
