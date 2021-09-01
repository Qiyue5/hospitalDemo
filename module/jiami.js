var crypto = require("crypto");

// 加密方法
function jiami(str) {
  let salt = "fjdsoigijasoigjasdiodgjasdiogjoasid";
  let obj = crypto.createHash("md5");
  str = salt + str;
  obj.update(str);
  return obj.digest("hex");
}

module.exports = jiami;
