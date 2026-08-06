const apostropheInText = require('./eslint-custom-rules/apostrophe-in-text')
const independentMocks = require('./eslint-custom-rules/independent-mocks')
const nbspInText = require('./eslint-custom-rules/nbsp-in-text')
const noDirectConsultOfferLog = require('./eslint-custom-rules/no-direct-consult-offer-log')
const noEmptyArrowFunction = require('./eslint-custom-rules/no-empty-arrow-function')
const noCurrencySymbols = require('./eslint-custom-rules/no-euro-usage')
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
const noThemeColors = require('./eslint-custom-rules/no-theme-colors')
const noThemeFromTheme = require('./eslint-custom-rules/no-theme-from-theme')
const noTsExpectError = require('./eslint-custom-rules/no-ts-expect-error')
const noUselessHook = require('./eslint-custom-rules/no-useless-hook')
const mockPathExists = require('./eslint-custom-rules/mock-path-exists')

const normalizeRule = (rule) => (typeof rule === 'function' ? { create: rule, meta: {} } : rule)

module.exports = {
  'apostrophe-in-text': normalizeRule(apostropheInText),
  'independent-mocks': normalizeRule(independentMocks),
  'nbsp-in-text': normalizeRule(nbspInText),
  'no-direct-consult-offer-log': normalizeRule(noDirectConsultOfferLog),
  'no-empty-arrow-function': normalizeRule(noEmptyArrowFunction),
  'no-euro-usage': normalizeRule(noCurrencySymbols),
  'no-hardcoded-id-in-svg': normalizeRule(noHardcodeIdInSvg),
  'no-raw-text': normalizeRule(noRawText),
  'no-truthy-check-after-queryAll-matchers': normalizeRule(noTruthyCheckAfterQueryAllMatchers),
  'no-use-of-algolia-multiple-queries': normalizeRule(noUseOfAlgoliaMultipleQueries),
  'todo-format': normalizeRule(todoFormat),
  'use-ternary-operator-in-jsx': normalizeRule(noStringCheckBeforeComponent),
  'use-the-right-test-utils': normalizeRule(useTheRightTestUtils),
  'no-queries-outside-query-files': normalizeRule(noQueriesOutsideQueryFiles),
  'queries-only-in-use-query-functions': normalizeRule(queriesOnlyInUseQueryFunctions),
  'queries-must-be-in-queries-folder': normalizeRule(queriesMustBeInQueriesFolder),
  'no-fireEvent': normalizeRule(noFireEvent),
  'no-get-spacing': normalizeRule(noGetSpacing),
  'no-theme-colors': normalizeRule(noThemeColors),
  'no-theme-from-theme': normalizeRule(noThemeFromTheme),
  'no-ts-expect-error': normalizeRule(noTsExpectError),
  'no-useless-hook': normalizeRule(noUselessHook),
  'mock-path-exists': normalizeRule(mockPathExists),
}
