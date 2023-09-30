const webSoker = require('ws');
const wss = new webSoker.Server({ port: 8080 })
const userInfoController = require('../controllers/userInfoController')
const articleController = require('../controllers/articleController')

module.exports = wss.on('connection', function (ws) {
  let route = ""
  let msg = ""
  ws.on('message', function (message) {
    if (message.toString() == "<--- ws send end --->") {
      sendOver()
    }
    if (route) {
      msg += message.toString()
    }
    try {
      route = Object.freeze(JSON.parse(message.toString()).path) ?? route
    } catch { }
  })
  function sendOver() {
    switch (route) {
      case "/my/update/avatar": {
        userInfoController.updateAvatar(msg, callback)
        break;
      }
      case "/article/add": {
        articleController.uploadArticle(msg, callback)
      }
      default: {
        break;
      }
    }
    function callback(value) {
      ws.send(JSON.stringify(value))
      ws.close()
    }
  }
});