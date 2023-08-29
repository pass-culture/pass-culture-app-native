const independentMocks = require('./eslint-custom-rules/independent-mocks')
const nbspInText = require('./eslint-custom-rules/nbsp-in-text')
const noRawText = require('./eslint-custom-rules/no-raw-text')
const noReactQueryProviderHOC = require('./eslint-custom-rules/no-react-query-provider-hoc')
const noStringCheckBeforeComponent = require('./eslint-custom-rules/no-string-check-before-component')
const todoFormat = require('./eslint-custom-rules/todo-format')
const apostropheInText = require('./eslint-custom-rules/apostrophe-in-text')
const useTheRightTestUtils = require('./eslint-custom-rules/use-the-right-test-utils')
const noUseOfAlgoliaMultipleQueries = require('./eslint-custom-rules/no-use-of-algolia-multiple-queries')
const noHardcodeIdInSvg = require('./eslint-custom-rules/no-hardcoded-id-in-svg')
const noTruthyCheckAfterQueryAllMatchers = require('./eslint-custom-rules/no-truthy-check-after-queryAll-matchers')

module.exports = {
  'independent-mocks': independentMocks,
  'nbsp-in-text': nbspInText,
  'no-hardcoded-id-in-svg': noHardcodeIdInSvg,
  'no-raw-text': noRawText,
  'no-react-query-provider-hoc': noReactQueryProviderHOC,
  'no-string-check-before-component': noStringCheckBeforeComponent,
  'todo-format': todoFormat,
  'apostrophe-in-text': apostropheInText,
  'use-the-right-test-utils': useTheRightTestUtils,
  'no-use-of-algolia-multiple-queries': noUseOfAlgoliaMultipleQueries,
  'no-truthy-check-after-queryAll-matchers': noTruthyCheckAfterQueryAllMatchers,
}
