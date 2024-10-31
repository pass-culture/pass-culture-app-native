const apostropheInText = require('./eslint-custom-rules/apostrophe-in-text')
const independentMocks = require('./eslint-custom-rules/independent-mocks')
const nbspInText = require('./eslint-custom-rules/nbsp-in-text')
const noEmptyArrowFunction = require('./eslint-custom-rules/no-empty-arrow-function')
const noCurrencySymbols = require('./eslint-custom-rules/no-currency-symbols')
const noHardcodeIdInSvg = require('./eslint-custom-rules/no-hardcoded-id-in-svg')
const noRawText = require('./eslint-custom-rules/no-raw-text')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/use-ternary-operator-in-jsx')
const noTruthyCheckAfterQueryAllMatchers = require('./eslint-custom-rules/no-truthy-check-after-queryAll-matchers')
const noUseOfAlgoliaMultipleQueries = require('./eslint-custom-rules/no-use-of-algolia-multiple-queries')
const todoFormat = require('./eslint-custom-rules/todo-format')
const useTheRightTestUtils = require('./eslint-custom-rules/use-the-right-test-utils')

module.exports = {
  'apostrophe-in-text': apostropheInText,
  'independent-mocks': independentMocks,
  'nbsp-in-text': nbspInText,
  'no-empty-arrow-function': noEmptyArrowFunction,
  'no-currency-symbols': noCurrencySymbols,
  'no-hardcoded-id-in-svg': noHardcodeIdInSvg,
  'no-raw-text': noRawText,
  'no-truthy-check-after-queryAll-matchers': noTruthyCheckAfterQueryAllMatchers,
  'no-use-of-algolia-multiple-queries': noUseOfAlgoliaMultipleQueries,
  'todo-format': todoFormat,
  'use-ternary-operator-in-jsx': noStringCheckBeforeComponent,
  'use-the-right-test-utils': useTheRightTestUtils,
}
