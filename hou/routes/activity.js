// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
//导入文章分类模块
const activityController =require('../controllers/activityAddController')

const expressJoi = require('../schemas/express-joi')
const {
  addCate_schema,
  deleteCate_schema,
  getCate_schema,
  updateCate_schema
} = require('../schemas/articleCaseSchema')


// 2、增加-文章分类
router.post(
  '/actdele',
  expressJoi(addCate_schema),
  activityController.getActivitydele
)

// 获取文章分类的列表数据
router.get('/act',activityController.getActivityList)

router.get('/actAdd',activityController.getActivityAdd)

// router.post('/actdele',expressJoi(addCate_schema),activityController.getActivitydele)


// 向外共享路由对象
module.exports = router