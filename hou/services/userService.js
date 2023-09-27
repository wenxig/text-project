//@ts-check
const { getData, addData, count } = require('../models/db').useDb('ev_users')


const JWT = require('../utils/JWT')

// 导入 bcryptjs 加密包
const bcrypt = require('bcryptjs')

const userService = {
  // 用户名是否被占用（同步方式演示）
  checkUser: (username, res) => {
    getData({ username: username }).then((rows) => {
      if (rows.length > 0) {
        return res.codeMsg('用户名被占用，请更换其他用户名！')
      }
    }).catch((err) => {
      return res.codeMsg(err)
    })
  },

  // 插入新用户
  addUser: (username, password, res) => {
    console.log(username,'-user');
    count({}).then((id) => {
      console.log(id);
      addData([{ username: username, password: password, id }]).then(() => {
        return res.codeMsg('注册成功！', 0)
      }).catch(() => {
        return res.codeMsg('注册用户失败，请稍后再试！')
      })
    }).catch(() => {
      return res.codeMsg('注册用户失败，请稍后再试！')
    })
  },

  // 用户登录
  loginUser: (username, password, res) => {
    getData({ username: username }).then((rows) => {
      if (rows.length !== 1) {
        return res.codeMsg('用户名不存在！')
      }

      // 密码是否正确（使用✨bcrypt.compareSync()对密码进行比较）
      const compareResult = bcrypt.compareSync(password, rows[0].password)

      if (!compareResult) {
        return res.codeMsg('密码错误！')
      }

      // 🚩设置token签名
      // 1、生成token
      const user = { ...rows[0], password: '', user_pic: '' } // 利用展开运算符的方式排出密码、照片等敏感信息
      const tokenStr = JWT.generate(user)

      // 2、发送token到客户端（header方式）
      // res.header('Authorization', token)
      return res.send({
        code: 0,
        message: '登录成功',
        token: 'Bearer ' + tokenStr
      })
    }).catch((err) => {
      return res.codeMsg(err)
    })
  }
}

module.exports = userService
