export default {
  inputFiles: [
    'static/*.bundle.js',
    'static/*.bundle.css',
    'static/*.ejs.html'
  ],
  revisedFiles: [
  ],
  inlinedFiles: [
    'static/index.bundle.js',
    'static/*.bundle.css'
  ],
  outputFiles: (file: string) => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (_filePath: string, _fileString: string, md5String: string, baseName: string, extensionName: string) => baseName + '-' + md5String + extensionName,
  base: 'static',
  fileSize: 'static/file-size.json'
}
