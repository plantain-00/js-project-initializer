export default {
  inputFiles: [
    '*.bundle.js',
    '*.bundle.css',
    '*.ejs.html'
  ],
  excludeFiles: [
    'service-worker.bundle.js'
  ],
  revisedFiles: [
  ],
  inlinedFiles: [
    'index.bundle.js',
    'index.bundle.css'
  ],
  outputFiles: (file: string) => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath: string, fileString: string, md5String: string, baseName: string, extensionName: string) => baseName + '-' + md5String + extensionName,
  fileSize: 'file-size.json'
}
