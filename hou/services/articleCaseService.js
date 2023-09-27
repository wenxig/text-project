//@ts-check
const { getData, updateData, updateAllData, deleteData } = require('../models/db').useDb('ysck_article')

const articleCaseService = {
  // 获取 - 文章分类
  getArtCateList: (/** @type {any} */ _req, /**@type {import('express').Response<any, Record<string, any>, number>}*/ res) => {
    getData({}).then((data) => {
      return res.send({
        code: 0,
        message: '获取文章分类列表成功！',
        data
      })
    })
  },

  // 增加 - 文章分类：查重
  checkArtCate: (req, res) => {
    getData({ $or: [req.body.cate_name, req.body.cate_alias] }).then((rows) => {
      // 1、分类名称 和 分类别名 都被占用
      if (rows.length === 2) return res.codeMsg('此分类已存在1！')
      if (
        rows.length === 1 &&
        rows[0].cate_name === req.body.cate_name &&
        rows[0].cate_alias === req.body.cate_alias
      ) {
        updateData({ cate_name: req.body.cate_name, cate_alias: req.body.cate_alias }, {
          $set: { "is_delete": 0 }
        }).catch(() => res.codeMsg('新增文章分类失败！')).then(() => res.codeMsg('新增文章分类成功！', 0))
      }
      // 2、分类名称 或 分类别名 被占用
      if (rows.length === 1 && rows[0].cate_name === req.body.cate_name)
        return res.codeMsg('此分类已存在3！')

      if (rows.length === 1 && rows[0].cate_alias === req.body.cate_alias)
        return res.codeMsg('分类别名被占用，请更换后重试！')
    })
  },

  // 增加 - 文章分类：添加到数据库
  addArtCate: (req, res) => {
    updateAllData(req.body).then(() => res.codeMsg('新增文章分类成功！', 0))
  },

  // 删除 - 文章分类：分类是否存在
  checkCateById: (req, res) => {
    getData({ id: req.query.id }).catch(() => {
      return res.codeMsg('分类不存在！')
    })
  },

  // 删除 - 文章分类：删除文章分类
  delArtCateList: (req, res) => {
    deleteData({ id: req.query.id })
      .then(() => res.codeMsg('删除文章分类成功！', 0))
      .catch(() => res.codeMsg('删除文章分类失败！'))
  },

  // 获取 - 文章分类详情
  getArticleDetail: (req, res) => {
    getData({ id: req.query.id })
      .then((data) => res.send({
        code: 0,
        message: '获取文章分类成功！',
        data: data[0]
      }))
      .catch(() => res.codeMsg('获取文章分类数据失败！'))
  },

  // 更新 - 文章分类：查重
  checkArtCateAll: (req, res) => {
    getData({
      $and: [
        { $not: { id: req.body.id } },
        {
          $or: [
            { cate_name: req.body.cate_name },
            { cate_alias: req.body.cate_alias }
          ]
        }
      ],
    }).then((rows) => {
      if (
        rows.length === 1 &&
        rows[0].cate_name === req.body.cate_name &&
        rows[0].cate_alias === req.body.cate_alias
      ) {
        return res.codeMsg('此分类已存在！')
      }
      // 分类名称 或 分类别名 被占用
      if (rows.length === 1 && rows[0].cate_name === req.body.cate_name)
        return res.codeMsg('此分类已存在！')
      if (rows.length === 1 && rows[0].cate_alias === req.body.cate_alias)
        return res.codeMsg('分类别名被占用，请更换后重试！')
    }).catch(() => res.codeMsg('此分类已存在！'))
  },

  // 更新 - 文章分类：更新到数据库
  updateCate: (req, res) => {
    updateAllData(req.body, { id: req.body.id })
      .then(() => res.codeMsg('更新分类信息成功！', 0))
      .catch(() => res.codeMsg('更新分类信息失败！'))
  },

  // 更新 - 文章分类图片：更新到数据库
  uploadImage: (req, res) => {
    updateData({
      "id": req.body.id
    }, {
      $set: {
        "pic_Url": req.body.image
      }
    }).then(() => res.codeMsg('更新头像成功！', 0)).catch(() => res.codeMsg('更新头像失败！'))
  },


  // 获取 - 文章分类图片
  uploadImg: (req, res) => {
    getData({
      $and: [
        { id: req.body.id },
        { pic_Url: true }
      ]
    }).then((results) => {
      if (results.length > 0) {
        const imageData = results[0].pic_Url;
        //@ts-ignore
        const base64Image = new Buffer.from(imageData, 'binary').toString('base64');
        res.send(base64Image); // 将base64编码的字符串发送给客户端   
      }
    })
  },
}

module.exports = articleCaseService
