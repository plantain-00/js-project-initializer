function printInConsole(message: unknown) {
  console.log(message)
}

printInConsole('app started!')

process.on('SIGINT', () => {
  process.exit()
})

process.on('SIGTERM', () => {
  process.exit()
})
