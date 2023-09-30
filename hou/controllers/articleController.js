const articleService = require('../services/articleService')

// 发布 - 文章
exports.uploadArticle = (ws, cb) => {
  const article = JSON.parse(ws).body
  // 1、文章封面是否存在（校验schema）(有必要后端检测吗)
  if (!article.cover_img) {
    return cb({ type: false, msg: "必须添加封面" })
  }
  // 2、发布文章
  articleService.uploadArticle(ws, cb)
}

// 获取 - 文章列表
exports.getArticleList = async (req, res) => {
  // 1、获取文章条数total
  const totalValue = await articleService.getArticleTotal(req, res)
  // console.log(totalValue)

  // 2、获取文章列表相关数据（修复筛选功能✨）
  articleService.getArticleList(req, res, totalValue)
}

// 获取 - 文章详情
exports.getArticleDetail = (req, res) => {
  articleService.getArticleDetail(req, res)
}

// 删除 - 文章
exports.delArticle = (req, res) => {
  articleService.delArticle(req, res)
}
