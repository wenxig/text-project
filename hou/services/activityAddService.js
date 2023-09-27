//@ts-check
const { useDb } = require('../models/db')
const { getData } = useDb('ysch_api')
const activityAddService = {
  // 获取 - 活动名称分类
  getActivityList: (/** @type {any} */ _req, /**@type {import('express').Response<any, Record<string, any>, number>}*/ res) => {
    getData({}).then((data) => {
      return res.send({
        code: 0,
        message: 'ok',
        data
      })
      //@ts-ignore
    }).catch((err) => res.codeMsg(err))
  },

  getActivityAdd: (/** @type {any} */ _req, /**@type {import('express').Response<any, Record<string, any>, number>}*/ res) => {
    getData({}).then((data) => {
      return res.send({
        code: 0,
        message: 'ok44444',
        data
      })
      //@ts-ignore
    }).catch((err) => res.codeMsg(err))
  },


  getActivitydele: (/** @type {any} */ _req, /**@type {import('express').Response<any, Record<string, any>, number>}*/ res) => {
    getData({
      $or: [
        { cate_name: "科技" },
        { cate_alias: "keji" }
      ]
    }).then((data) => {
      return res.send({
        code: 0,
        message: 'ok11',
        data: data
      })
      //@ts-ignore
    }).catch((err) => res.codeMsg(err))
  },

}

module.exports = activityAddService