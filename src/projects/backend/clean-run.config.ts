export default {
  include: [
    'dist/*.js',
    'package.json',
    'yarn.lock'
  ],
  exclude: [
  ],
  postScript: ({ dir }) => [
    `cd "${dir}" && yarn --production && node dist/index.js`
  ]
}
