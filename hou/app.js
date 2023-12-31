const createError = require('http-errors')
const express = require('express')
let app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const joi = require('joi')
const expressJWT = require('express-jwt')
const jwtConfig = require('./config/jwt.config')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const userInfoRouter = require('./routes/userInfo')
const articleCaseRouter = require('./routes/articleCase')
const articleRouter = require('./routes/article')
const menusRouter = require('./routes/layout')
// 导入并使用活动路由模块
const activityRouter = require('./routes/activity')
const wss = require("./routes/ws")
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
// res.send()数据响应👏封装（代码优化）（路由之前）
app.use(function (_req, res, next) {
  // code = 0 为成功； code = 1 为失败； 默认将 code 的值设置为 1，方便处理失败的情况
  res.codeMsg = function (err, code = 1) {
    res.send({
      // 状态
      code,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 1、注册解析token的中间件（token过期校验、白名单放行）
app.use(
  expressJWT({ secret: jwtConfig.jwtSecretKey }).unless({ path: [/^\/api\//] })
)

app.use('/', indexRouter)

// 登录注册路由模块
app.use('/api', userRouter)
// 用户相关接口
app.use('/my', userInfoRouter)
// 文章分类接口
app.use('/my/cate', articleCaseRouter)
// 文章管理接口
app.use('/my/article', articleRouter)
// 侧边栏布局
app.use('/my/menus', menusRouter)

// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/activity', activityRouter)

// 错误级别中间件
app.use(function (err, req, res, next) {
  // express-joi：Joi 参数校验失败
  if (err instanceof joi.ValidationError) {
    return res.send(JSON.stringify(err))
  }

  // 2、express-jwt：捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.send('身份认证失败！')

  // 其他未知错误
  return res.send(err)
})

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
