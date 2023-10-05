const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articleController')

// 1、合法性校验
const expressJoi = require('../schemas/express-joi')
const {
  // addArticle_schema,
  getArticleList_schema,
  get_delArticle_schema
} = require('../schemas/articleSchema')

// 2、获取-文章列表
router.get(
  '/list',
  expressJoi(getArticleList_schema),
  articleController.getArticleList)

// 3、获取-文章详情
router.get(
  '/info',
  // expressJoi(get_delArticle_schema),
  articleController.getArticleDetail
)

// 4、删除-文章
router.delete(
  '/info',
  // expressJoi(get_delArticle_schema),
  articleController.delArticle
)

module.exports = router
