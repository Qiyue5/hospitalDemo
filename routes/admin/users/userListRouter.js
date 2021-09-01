var express = require("express");
var router = express.Router();
var sqlQuery = require("../../../module/wqyMysql");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  // 查找数据库的用户表
  let page = req.query.page;
  page = page ? page : 1;
  let sqlStr = "select * from user limit ?,5";
  let result = await sqlQuery(sqlStr, [(parseInt(page) - 1) * 5]);

  let options = {
    userlist: Array.from(result),
  };
  res.render("admin/users/userlist1", options);
});

router.post("/deluser", async (req, res) => {
  let dellist = req.body["dellist[]"];
  dellist.forEach(async (item, i) => {
    let sqlStr = "delete from user where id = ?";
    await sqlQuery(sqlStr, item);
  });
  res.json({
    state: "ok",
    content: "cg",
  });
});

module.exports = router;
