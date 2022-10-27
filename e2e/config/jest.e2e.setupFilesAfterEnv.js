// This prevents jest from adding verbose headers to the logs when the --verbose is set
if (global.console.constructor.name === 'CustomConsole') {
  // you can also override the global.console with another CustomConsole of yours, like https://stackoverflow.com/a/57443150
  global.console = require('console')
}
