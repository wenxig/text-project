const os = require('os');
module.exports = os.type() == 'Darwin' ? {
  host: 'mongodb://127.0.0.1:27017/',
  database: 'ysck',

} : (os.type() == 'Windows_NT' ? {
  host: '',
  database: '',

} : {
  host: '101.200.148.224',
  database: '',
})