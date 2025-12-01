const apostropheInText = require('./eslint-custom-rules/apostrophe-in-text')
const independentMocks = require('./eslint-custom-rules/independent-mocks')
const nbspInText = require('./eslint-custom-rules/nbsp-in-text')
const noDirectConsultOfferLog = require('./eslint-custom-rules/no-direct-consult-offer-log')
const noEmptyArrowFunction = require('./eslint-custom-rules/no-empty-arrow-function')
const noCurrencySymbols = require('./eslint-custom-rules/no-currency-symbols')
const noHardcodeIdInSvg = require('./eslint-custom-rules/no-hardcoded-id-in-svg')
const noRawText = require('./eslint-custom-rules/no-raw-text')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/use-ternary-operator-in-jsx')
const noTruthyCheckAfterQueryAllMatchers = require('./eslint-custom-rules/no-truthy-check-after-queryAll-matchers')
const noUseOfAlgoliaMultipleQueries = require('./eslint-custom-rules/no-use-of-algolia-multiple-queries')
const todoFormat = require('./eslint-custom-rules/todo-format')
const useTheRightTestUtils = require('./eslint-custom-rules/use-the-right-test-utils')
const noQueriesOutsideQueryFiles = require('./eslint-custom-rules/no-queries-outside-query-files.js')
const queriesOnlyInUseQueryFunctions = require('./eslint-custom-rules/queries-only-in-use-query-functions.js')
const queriesMustBeInQueriesFolder = require('./eslint-custom-rules/queries-must-be-in-queries-folder.js')
const noFireEvent = require('./eslint-custom-rules/no-fireEvent')
const noGetSpacing = require('./eslint-custom-rules/no-get-spacing')
const noSpacer = require('./eslint-custom-rules/no-spacer')
const noThemeColors = require('./eslint-custom-rules/no-theme-colors')
const noThemeFromTheme = require('./eslint-custom-rules/no-theme-from-theme')
const noTsExpectError = require('./eslint-custom-rules/no-ts-expect-error')
const noUselessHook = require('./eslint-custom-rules/no-useless-hook')
const mockPathExists = require('./eslint-custom-rules/mock-path-exists')
const queryHooksMustReturnUseQueryResult = require('./eslint-custom-rules/query-hooks-must-return-use-query-result')

module.exports = {
  'apostrophe-in-text': apostropheInText,
  'independent-mocks': independentMocks,
  'nbsp-in-text': nbspInText,
  'no-direct-consult-offer-log': noDirectConsultOfferLog,
  'no-empty-arrow-function': noEmptyArrowFunction,
  'no-currency-symbols': noCurrencySymbols,
  'no-hardcoded-id-in-svg': noHardcodeIdInSvg,
  'no-raw-text': noRawText,
  'no-truthy-check-after-queryAll-matchers': noTruthyCheckAfterQueryAllMatchers,
  'no-use-of-algolia-multiple-queries': noUseOfAlgoliaMultipleQueries,
  'todo-format': todoFormat,
  'use-ternary-operator-in-jsx': noStringCheckBeforeComponent,
  'use-the-right-test-utils': useTheRightTestUtils,
  'no-queries-outside-query-files': noQueriesOutsideQueryFiles,
  'queries-only-in-use-query-functions': queriesOnlyInUseQueryFunctions,
  'queries-must-be-in-queries-folder': queriesMustBeInQueriesFolder,
  'no-fireEvent': noFireEvent,
  'no-get-spacing': noGetSpacing,
  'no-spacer': noSpacer,
  'no-theme-colors': noThemeColors,
  'no-theme-from-theme': noThemeFromTheme,
  'no-ts-expect-error': noTsExpectError,
  'no-useless-hook': noUselessHook,
  'mock-path-exists': mockPathExists,
  'query-hooks-must-return-use-query-result': queryHooksMustReturnUseQueryResult,
}
