//@ts-check

const { aggregate, addData, count, updateData } = require('../models/db').useDb("ev_articles")

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
      cover_img: path.join(__dirname, `../public/uploads/${uid}_${time}`, 'cover_img.txt'),
      // 文章发布时间
      pub_date: time,
      // 文章作者的Id
      author_id: uid,
      state: article.state,
      article: path.join(__dirname, `../public/uploads/${uid}_${time}`, 'article.md')
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
  getArticleList: (req, res, totalValue) => {
    // 当前页的第一个索引值
    const pageIndex = (req.query.pagenum - 1) * req.query.pagesize
    aggregate([
      {
        $match: {
          state: "已发布"
        }
      },
      {
        $lookup: {
          from: "ev_article_cate",
          localField: "cate_id",
          foreignField: "id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $project: {
          id: "$_id",
          title: 1,
          pub_date: 1,
          state: 1,
          "category.cate_name": 1,
          "category.pic_Url": 1,
          content: 1
        }
      },
      {
        $skip: pageIndex
      },
      {
        $limit: req.query.pagesize
      }
    ]).then((rows) => res.send({
      code: 0,
      message: '获取文章列表成功！',
      total: totalValue,
      data: rows
    })).catch((err) => res.codeMsg(err))
  },

  // 获取 - 文章详情
  getArticleDetail: (req, res) => {
    aggregate([{
      $match: {
        id: req.query.id
      }
    },
    {
      $lookup: {
        from: "ev_article_cate",
        localField: "cate_id",
        foreignField: "id",
        as: "category"
      }
    },
    {
      $lookup: {
        from: "ev_users",
        localField: "author_id",
        foreignField: "id",
        as: "author"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $unwind: "$author"
    },
    {
      $project: {
        _id: 0, // 不包含 _id 字段
        id: 1,
        title: 1,
        content: 1,
        cover_img: 1,
        pub_date: 1,
        state: 1,
        cate_id: 1,
        author_id: 1,
        "category.cate_name": 1,
        "category.pic_Url": 1,
        "author.username": 1,
        "author.nickname": 1
      }
    }]).then((rows) => {
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
    updateData({ id: req.query.id }, { $set: { is_delete: 1 } }).then((rows) => {
      return res.codeMsg('删除成功！', 0)
    }).catch(() => res.codeMsg('您要删除的文章不存在！'))
  }
}

module.exports = articleService
