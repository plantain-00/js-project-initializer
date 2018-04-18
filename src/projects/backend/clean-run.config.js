module.exports = {
  include: [
    'dist/*.js',
    'package.json'
  ],
  exclude: [
  ],
  postScript: [
    'cd "[dir]" && npm i --production && node dist/index.js'
  ]
}
