import minimist from 'minimist'
import * as packageJson from '../package.json'

let suppressError = false

function showToolVersion() {
  console.log(`Version: ${packageJson.version}`)
}

function showHelp() {
  console.log(`Version ${packageJson.version}
Syntax:   REPOSITORY_NAME [options]
Examples: REPOSITORY_NAME
Options:
 -h, --help                                         Print this message.
 -v, --version                                      Print the version
`)
}

async function executeCommandLine() {
  const argv = minimist(process.argv.slice(2), { '--': true }) as unknown as {
    v?: unknown
    version?: unknown
    suppressError?: unknown
    h?: unknown
    help?: unknown
  }

  const showVersion = argv.v || argv.version
  if (showVersion) {
    showToolVersion()
    return
  }

  if (argv.h || argv.help) {
    showHelp()
    return
  }

  suppressError = !!argv.suppressError

  // todo
}

executeCommandLine().then(() => {
  console.log(`REPOSITORY_NAME success.`)
}, (error: unknown) => {
  if (error instanceof Error) {
    console.log(error.message)
  } else {
    console.log(error)
  }
  if (!suppressError) {
    process.exit(1)
  }
})
