let fs = require("fs");

function rename(req) {
  //console.log(req.file)
  let oldPath = req.file.destination + "/" + req.file.filename;
  let newPath =
    req.file.destination + "/" + req.file.filename + req.file.originalname;
  fs.rename(oldPath, newPath, () => {
    //console.log("改名成功")
  });
  return {
    state: "ok",
    imgUrl: "/upload/" + req.file.filename + req.file.originalname,
  };
}

module.exports = rename;
