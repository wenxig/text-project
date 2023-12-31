//@ts-check

const articleCaseService = require('../services/articleCaseService')
// 获取 - 文章分类
exports.getArtCateList = (req, res) => {
  articleCaseService.getArtCateList(req, res)
}

// 增加 - 文章分类
exports.addArtCate = (req, res) => {

  // 1、分类名、别名查重
  articleCaseService.checkArtCate(req, res)

  // 2、新增文章分类
  articleCaseService.addArtCate(req, res)
}

// 删除 - 文章分类
exports.delArtCateList = (req, res) => {
  // 1、分类存在性验证
  articleCaseService.checkCateById(req, res)

  // 2、删除文章分类
  articleCaseService.delArtCateList(req, res)
}

// 获取 - 文章分类详情
exports.getArticleDetail = (req, res) => {
  articleCaseService.getArticleDetail(req, res)
}

// 更新 - 文章分类
exports.updateCate = (req, res) => {
  // 1、分类名、别名查重
  // articleCaseService.checkArtCateAll(req, res)

  // 2、更新文章分类
  articleCaseService.updateCate(req, res)
}

// 更新-文章分类图片
exports.updateImage = (req, res) => {
  articleCaseService.uploadImage(req, res) 
}  

// 读取-文章分类图片
exports.uploadImg = (req, res) => {
  articleCaseService.uploadImg(req, res) 
}  


