import * as electron from 'electron'

let mainWindow: Electron.BrowserWindow | undefined

electron.app.on('window-all-closed', () => {
  electron.app.quit()
})

electron.app.on('ready', () => {
  mainWindow = new electron.BrowserWindow({ width: 1200, height: 800 })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.on('closed', () => {
    mainWindow = undefined
  })
  mainWindow.webContents.openDevTools()
})
