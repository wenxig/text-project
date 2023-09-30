//@ts-check
const { getDataWithOptions, updateData, getData } = require('../models/db').useDb("ev_users")

// 导入 bcryptjs 加密包
const bcrypt = require('bcryptjs');
const { decompress } = require('lz-string');
const crypto = require("crypto-js")
const userInfoService = {
  // 获取 - 用户基本资料
  getUserInfo: async (req, res) => {
    console.log(req.user.data);
    // (id 为数据库自增id)
    // @ts-ignore
    const result = await getDataWithOptions({ "id": req.user.data.id }, {})
    console.log(result);
    if (result?.length !== 1) {
      return res.codeMsg('获取用户信息失败！')
    }
    // 获取成功提示
    return res.send({
      code: 0,
      message: '获取用户基本信息成功！',
      data: result[0]
    })
  },

  // 更新-用户基本资料
  updateUserInfo: (req, res) => {
    updateData({ id: req.body.id }, {
      $set: req.body
    }).then(() => {
      return res.codeMsg('修改用户信息成功！', 0)
    }).catch((err) => {
      console.log('update err:', err);
      return res.codeMsg('修改用户基本信息失败！')
    })
    console.log(req.body);
  },

  // 更新 - 用户密码：用户真实存在判断
  checkUserID: (req, res) => {
    getData({ id: req.user.data.id }).then((rows) => {
      if (rows.length !== 1) {
        return res.codeMsg('用户不存在！')
      }

      // 密码是否正确（使用✨bcrypt.compareSync()对密码进行比较）
      const compareResult = bcrypt.compareSync(
        req.body.old_pwd,
        rows[0].password
      )

      if (!compareResult) {
        return res.codeMsg('原密码错误！')
      }
    })
  },

  // 更新 - 用户密码：更新新密码
  updatePassword: (req, res) => {
    // 先使用✨bcrypt.hashSync()对新密码加密
    const new_pwd = bcrypt.hashSync(req.body.new_pwd, 10)

    // 然后更新密码
    updateData({ id: req.user.data.id }, {
      $set: {
        password: new_pwd
      }
    }).then(() => {
      return res.codeMsg('更新密码成功', 0)
    }).catch(() => {
      return res.codeMsg('更新密码失败！')
    })
  },

  // 更新-用户头像
  updateAvatar: (json, ws) => {
    let { body: data, id } = JSON.parse(json)
    updateData({ id }, {
      $set: {
        user_pic: data.img
      }
    }).then(() => ws({ type: true, msg: "头像更新成功" })).catch(() => ws({ type: false, msg: "头像更新失败" }))
  }
}

module.exports = userInfoService
