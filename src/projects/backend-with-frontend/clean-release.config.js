module.exports = {
  include: [
    'dist/*.js',
    'static/*.bundle-*.js',
    'static/index.html',
    'LICENSE',
    'package.json',
    'yarn.lock',
    'README.md'
  ],
  exclude: [
  ],
  askVersion: true,
  releaseRepository: 'https://github.com/AUTHOR/REPOSITORY_NAME-release.git',
  postScript: [
    // 'cd "[dir]" && rm -rf .git',
    // 'cp Dockerfile "[dir]"',
    // 'cd "[dir]" && docker build -t AUTHOR/REPOSITORY_NAME . && docker push AUTHOR/REPOSITORY_NAME'
    'git add package.json',
    'git commit -m "[version]"',
    'git tag v[version]',
    'git push',
    'git push origin v[version]',
  ]
}
