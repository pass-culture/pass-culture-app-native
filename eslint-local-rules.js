const noAllowConsole = require('./eslint-custom-rules/no-allow-console')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/no-string-check-before-component')
const independantMocks = require('./eslint-custom-rules/independant-mocks')

module.exports = {
  'no-allow-console': noAllowConsole,
  'no-string-check-before-component': noStringCheckBeforeComponent,
  'independant-mocks': independantMocks,
}
