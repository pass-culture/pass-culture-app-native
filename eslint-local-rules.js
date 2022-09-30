const independantMocks = require('./eslint-custom-rules/independant-mocks')
const nbspInFrench = require('./eslint-custom-rules/nbsp-in-french')
const noAllowConsole = require('./eslint-custom-rules/no-allow-console')
const noRawText = require('./eslint-custom-rules/no-raw-text')
const noReactQueryProviderHOC = require('./eslint-custom-rules/no-react-query-provider-hoc')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/no-string-check-before-component')
const todoFormat = require('./eslint-custom-rules/todo-format')

module.exports = {
  'independant-mocks': independantMocks,
  'nbsp-in-french': nbspInFrench,
  'no-allow-console': noAllowConsole,
  'no-raw-text': noRawText,
  'no-react-query-provider-hoc': noReactQueryProviderHOC,
  'no-string-check-before-component': noStringCheckBeforeComponent,
  'todo-format': todoFormat,
}
