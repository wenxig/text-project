const { Pool, promisePool } = require('../models/db')

const articleModel = require('../models/articleModel')
const fs = require("fs")
const path = require('path')

const path = require('path')
// const { setTimeout } = require('timers/promises') // 没有使用

/**
 * @description 切片上传暂存
 * @type {Record<string,any[]>}
 * **/
const temp = {}

const articleService = {
  // 发布 - 文章
  uploadArticle: (req, res) => {
    const time = new Date()
    /** @type {string} **/
    const uid = req.user.data.id


    /** @type {number} 最大切片**/
    const chunkMax = new Number(req.query.maxchunk)
    /** @type {number} 当前切片**/
    const nowChunk = new Number(req.query.chunk)
    temp[uid][nowChunk] = new String(req.body.dataChunk) // 保存当前信息体
    if (chunkMax == nowChunk) { // 终止接受
      /**@type {string}**/
      let data = ""
      temp[uid].forEach((val) => {
        data += val
      })
      delete temp[uid]; // 删除缓存
      /** @type {Record<string,any>} 完整数据**/
      const article = JSON.parse(data)
      try {
        article.imgs.forEach((/** base64img @type {string}**/val) => { //逐个写入文件
          try {
            fs.writeFile(path.join(__dirname, '../public/uploads', `${uid}_${time.getDate()}`), val)
          } catch {
            throw 'err!!'
          }
        })
        fs.writeFile(path.join(__dirname, '../public/uploads', `${uid}_coverimg`), article.cover_img)
      } catch {
        return res.codeMsg('发布文章失败！')
      }
    }

    const articleInfo = {
      // 标题、内容、状态、所属的分类Id
      ...req.body,
      // 文章封面在服务器端的存放路径
      cover_img: path.join('/public/uploads', `${uid}_coverimg`),
      // 文章发布时间
      pub_date: time,
      // 文章作者的Id
      author_id: uid
    }
    Pool.query(articleModel.insertArticle, articleInfo, function (err, rows) {
      if (err) return res.codeMsg(err)

      if (rows.affectedRows !== 1) return res.codeMsg('发布文章失败！')

      return res.codeMsg('发布文章成功！', 0)
    })
  },

  // 获取 - 文章列表：文章条数total
  getArticleTotal: async (req, res) => {
    const [rows] = await promisePool
      .query(articleModel.countAll)
      .catch((err) => {
        if (err) return res.codeMsg(err)
        if (rows.length !== 1) return res.codeMsg('获取文章列表失败！')
      })

    // console.log(rows)
    return rows[0].total
  },

  // 获取 - 文章列表：获取数据（附加筛选功能✨）
  getArticleList: (req, res, totalValue) => {
    // 当前页的第一个索引值
    const pageIndex = (req.query.pagenum - 1) * req.query.pagesize

    Pool.query(
      articleModel.selectList,
      [pageIndex, req.query.pagesize],
      function (err, rows) {
        if (err) return res.codeMsg(err)

        return res.send({
          code: 0,
          message: '获取文章列表成功！',
          total: totalValue,
          data: rows
        })
      }
    )
  },

  // 获取 - 文章详情
  getArticleDetail: (req, res) => {
    Pool.query(
      articleModel.selectArtById,
      [req.query.id],
      function (err, rows) {
        if (err) return res.codeMsg(err)

        if (rows.length !== 1) return res.codeMsg('没有查到对应的数据！')

        return res.send({
          code: 0,
          message: '获取文章成功！',
          data: rows[0]
        })
      }
    )
  },

  // 删除 - 文章
  delArticle: (req, res) => {
    Pool.query(articleModel.delArticle, [req.query.id], function (err, rows) {
      if (err) return res.codeMsg(err)

      if (rows.affectedRows !== 1) return res.codeMsg('您要删除的文章不存在！')

      return res.codeMsg('删除成功！', 0)
    })
  }
}

module.exports = articleService
