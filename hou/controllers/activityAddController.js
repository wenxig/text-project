const activityAddService = require("../services/activityAddService")

exports.getActivityList = (req, res) => {
  //res.send("oppp")
  activityAddService.getActivityList(req, res)
}
//插入一行
exports.getActivityAdd = (req, res) => {
  activityAddService.getActivityAdd(req, res)
}

//插入一行
exports.getActivitydele = (req, res) => {
  activityAddService.getActivitydele(req, res)
}

