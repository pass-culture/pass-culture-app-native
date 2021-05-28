const noAllowConsole = require('./eslint-custom-rules/no-allow-console')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/no-string-check-before-component')

module.exports = {
  'no-allow-console': noAllowConsole,
  'no-string-check-before-component': noStringCheckBeforeComponent,
}
