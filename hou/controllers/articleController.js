const articleService = require('../services/articleService')

// 发布 - 文章
exports.uploadArticle = (ws) => {
  let smsg=""
  ws.on('message', function (msg) {
    smsg += msg
  })
  ws.on("close",()=>{
    const article = JSON.parse(smsg)
    // 1、文章封面是否存在（校验schema）(有必要后端检测吗)
    if (!article.cover_img) {
      return res.codeMsg('文章封面是必选参数！')
    }
    // 2、发布文章
    articleService.uploadArticle(req, res)
  })
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
