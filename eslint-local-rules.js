const noAllowConsole = require('./eslint-custom-rules/no-allow-console')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/no-string-check-before-component')
const independantMocks = require('./eslint-custom-rules/independant-mocks')
const noReactQueryProviderHOC = require('./eslint-custom-rules/no-react-query-provider-hoc')
const nbspInFrenchTranslations = require('./eslint-custom-rules/nbsp-in-french-translations')
const todoFormat = require('./eslint-custom-rules/todo-format')
const noRawText = require('./eslint-custom-rules/no-raw-text')

module.exports = {
  'no-allow-console': noAllowConsole,
  'no-string-check-before-component': noStringCheckBeforeComponent,
  'independant-mocks': independantMocks,
  'no-react-query-provider-hoc': noReactQueryProviderHOC,
  'nbsp-in-french-translations': nbspInFrenchTranslations,
  'todo-format': todoFormat,
  'no-raw-text': noRawText,
}
