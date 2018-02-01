const { name, devDependencies: { electron: electronVersion } } = require('./package.json')

module.exports = {
  include: [
    'main.js',
    'scripts/index.css',
    'scripts/index.js',
    'scripts/index.html',
    'LICENSE',
    'package.json',
    'README.md'
  ],
  exclude: [
  ],
  askVersion: true,
  changesGitStaged: true,
  postScript: [
    'git add package.json',
    'git commit -m "v[version]"',
    'git tag v[version]',
    'git push',
    'git push origin v[version]',
    'cd "[dir]" && npm i --production',
    'prune-node-modules "[dir]/node_modules"',
    `electron-packager "[dir]" "${name}" --out=dist --arch=x64 --electron-version=${electronVersion} --platform=darwin --ignore="dist/"`,
    `electron-packager "[dir]" "${name}" --out=dist --arch=x64 --electron-version=${electronVersion} --platform=win32 --ignore="dist/"`,
    `7z a -r -tzip dist/${name}-darwin-x64-[version].zip dist/${name}-darwin-x64/`,
    `7z a -r -tzip dist/${name}-win32-x64-$[version].zip dist/${name}-win32-x64/`,
    `electron-installer-windows --src dist/${name}-win32-x64/ --dest dist/`,
    `cd dist && create-dmg ${name}-darwin-x64/${name}.app`
  ]
}