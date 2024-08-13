const independentMocks = require('./eslint-custom-rules/independent-mocks')
const nbspInText = require('./eslint-custom-rules/nbsp-in-text')
const noRawText = require('./eslint-custom-rules/no-raw-text')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/use-ternary-operator-in-jsx')
const todoFormat = require('./eslint-custom-rules/todo-format')
const apostropheInText = require('./eslint-custom-rules/apostrophe-in-text')
const useTheRightTestUtils = require('./eslint-custom-rules/use-the-right-test-utils')
const noUseOfAlgoliaMultipleQueries = require('./eslint-custom-rules/no-use-of-algolia-multiple-queries')
const noHardcodeIdInSvg = require('./eslint-custom-rules/no-hardcoded-id-in-svg')
const noTruthyCheckAfterQueryAllMatchers = require('./eslint-custom-rules/no-truthy-check-after-queryAll-matchers')
const noEmptyArrowFunction = require('./eslint-custom-rules/no-empty-arrow-function')
const noNullLiteralsTemplate = require('./eslint-custom-rules/no-null-literals-template')

module.exports = {
  'independent-mocks': independentMocks,
  'nbsp-in-text': nbspInText,
  'no-empty-arrow-function': noEmptyArrowFunction,
  'no-hardcoded-id-in-svg': noHardcodeIdInSvg,
  'no-null-literals-template': noNullLiteralsTemplate,
  'no-raw-text': noRawText,
  'use-ternary-operator-in-jsx': noStringCheckBeforeComponent,
  'todo-format': todoFormat,
  'apostrophe-in-text': apostropheInText,
  'use-the-right-test-utils': useTheRightTestUtils,
  'no-use-of-algolia-multiple-queries': noUseOfAlgoliaMultipleQueries,
  'no-truthy-check-after-queryAll-matchers': noTruthyCheckAfterQueryAllMatchers,
}
