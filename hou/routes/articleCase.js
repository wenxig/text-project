const express = require('express')
const router = express.Router()

const articleCaseController = require('../controllers/articleCaseController')

const expressJoi = require('../schemas/express-joi')
const {
  addCate_schema,
  deleteCate_schema,
  getCate_schema,
  updateCate_schema,
  updateImage_schema
} = require('../schemas/articleCaseSchema')

// 2、解析multipart / form-data数据（主要是图片）
const multer = require('multer')
const path = require('path')
// —— 通过实例对象multer、fs模块指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../public/uploads/') })

// 1、获取-文章分类（查询所有）
router.get('/list', articleCaseController.getArtCateList)

// 2、增加-文章分类
router.post(
  '/add',
  expressJoi(addCate_schema),
  articleCaseController.addArtCate
)

// 3、获取-文章分类详情（根据id值）
router.get(
  '/info',
  expressJoi(getCate_schema),
  articleCaseController.getArticleDetail
)

// 4、更新-文章分类
router.put(
  '/info',
  expressJoi(updateCate_schema),
  articleCaseController.updateCate
)



// 5、删除-文章分类
router.delete(
  '/del',
  expressJoi(deleteCate_schema),
  articleCaseController.delArtCateList
)

// 6、增加-文章分类图片
router.post(
  '/update/image',
  upload.single('cover_img'),
  expressJoi(updateImage_schema),
  articleCaseController.updateImage
)
// 6、增加-文章分类图片
router.post(
  '/upload/img',
  articleCaseController.uploadImg
)




module.exports = router
