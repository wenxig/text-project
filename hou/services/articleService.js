const { addData, count, updateData, getData, deleteData } = require('../models/db').useDb("ev_articles")
const lodash = require("lodash")
const fs = require("fs")
const path = require('path')

const articleService = {
  // 发布 - 文章
  uploadArticle: (msg, cb) => {
    const { id: uid, body } = JSON.parse(msg)
    const time = new Date().getTime()
    const article = body
    fs.mkdir(path.join(__dirname, `../public/uploads/${uid}_${time}`), () => {
      fs.writeFile(path.join(__dirname, `../public/uploads/${uid}_${time}`, 'article.md'), article.article, () => { })
      fs.writeFile(path.join(__dirname, `../public/uploads/${uid}_${time}`, 'cover_img.txt'), article.cover_img, () => { })
    })
    const articleInfo = {
      title: article.title,
      cate_id: article.cate_id,
      // 文章封面在服务器端的存放路径
      cover_img: path.join(`/${uid}_${time}`, 'cover_img.txt'),
      // 文章发布时间
      pub_date: time,
      // 文章作者的Id
      author_id: uid,
      state: article.state,
      article: path.join(`/${uid}_${time}`, 'article.md')
    }
    addData([articleInfo]).then(() => cb({ msg: "上传成功", type: true })).catch(() => cb({ msg: "上传失败", type: false }))
  },

  // 获取 - 文章列表：文章条数total
  getArticleTotal: async (_req, res) => {
    /**@type { number }*/let total = 0;
    try {
      total = await count({})
    } catch (err) {
      res.codeMsg('获取文章列表失败！')
    }
    return total
  },

  // 获取 - 文章列表：获取数据（附加筛选功能✨）
  getArticleList: (/**@type {import("express").Request<{}, any, any, qs.ParsedQs, Record<string, any>>}*/req, res, totalValue) => {
    // 当前页的第一个索引值
    const /** @type {import("mongodb").Filter<import("bson").Document>} */ searchRule = {}
    if (!lodash.isEmpty(req.query.cate_id)) {
      searchRule.cate_id = req.query.cate_id
    }
    if (!lodash.isEmpty(req.query.state)) {
      searchRule.state = req.query.state
    }
    getData(searchRule).then((rows) => {
      const chunks = lodash.chunk(rows, lodash.toNumber(req.query.pagesize))
      res.send({
        code: 0,
        message: '获取文章列表成功！',
        total: totalValue,
        data: chunks[lodash.toNumber(req.query.pagenum) - 1]
      })
    }).catch((err) => res.codeMsg(err))
  },

  // 获取 - 文章详情
  getArticleDetail: (/**@type {import("express").Request<{}, any, any, qs.ParsedQs, Record<string, any>>}*/req, res) => {
    getData({
      pub_date: lodash.toNumber(req.query.pub_date)
    }).then((rows) => {
      if (rows.length !== 1) return res.codeMsg('没有查到对应的数据！')
      return res.send({
        code: 0,
        message: '获取文章成功！',
        data: rows[0]
      })
    })
  },

  // 删除 - 文章
  delArticle: (req, res) => {
    getData({
      pub_date: lodash.toNumber(req.query.pub_date)
    }).then((rows) => {
      const row = rows[0]
      const /**@type {string}*/ ap = row.article
      const pa = path.join(__dirname, '../public/uploads', ap.split('/')[1])
      fs.rmdir(pa, { recursive: true, force: true }, (err) => {
        if (err) {
          console.log(err);
        }
      })
    })
    deleteData({
      pub_date: lodash.toNumber(req.query.pub_date)
    }).then(() => {
      return res.codeMsg('删除成功！', 0)
    }).catch(() => res.codeMsg('您要删除的文章不存在！'))
  }
}

module.exports = articleService
