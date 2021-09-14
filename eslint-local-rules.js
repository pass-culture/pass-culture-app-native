const noAllowConsole = require('./eslint-custom-rules/no-allow-console')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/no-string-check-before-component')
const independantMocks = require('./eslint-custom-rules/independant-mocks')
const noReactQueryProviderHOC = require('./eslint-custom-rules/no-react-query-provider-hoc')

module.exports = {
  'no-allow-console': noAllowConsole,
  'no-string-check-before-component': noStringCheckBeforeComponent,
  'independant-mocks': independantMocks,
  'no-react-query-provider-hoc': noReactQueryProviderHOC,
}
