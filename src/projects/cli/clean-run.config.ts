export default {
  include: [
    'bin/*',
    'dist/*.js',
    'package.json',
    'yarn.lock'
  ],
  exclude: [
  ],
  postScript: ({ dir }) => [
    `cd "${dir}" && yarn --production`,
    `node ${dir}/dist/index.js`
  ]
}
