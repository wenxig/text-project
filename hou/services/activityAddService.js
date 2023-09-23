const { Pool } = require('../models/db')

const activityAddModel = require('../models/activityAddModel')

const activityAddService = {
  // 获取 - 活动名称分类
  getActivityList: (_req, res) => {
    Pool.query(activityAddModel.selectAllCase, function (err, rows) {
      if (err) {
        return res.codeMsg(err)
      }
      return res.send({
        code: 0,
        message: 'ok',
        data: rows
      })
    })
  },

  getActivityAdd: (_req, res) => {
    Pool.query(activityAddModel.addCase, function (err, rows) {
      if (err) {
        return res.codeMsg(err)
      }
      return res.send({
        code: 0,
        message: 'ok44444',
        data: rows
      })
    })
  },


  getActivitydele: (_req, res) => {
    Pool.query(activityAddModel.activityDele, function (err, rows) {
      if (err) {
        return res.codeMsg(err)
      }
      return res.send({
        code: 0,
        message: 'ok11',
        data: rows
      })
    })
  },

}

module.exports = activityAddService