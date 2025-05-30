/* eslint-disable @typescript-eslint/no-var-requires */
const { boundariesRule } = require('./eslint-custom-rules/boundaries-rule')

const softRules = {
  cleancode: {
    'react/no-unstable-nested-components': 'warn', // TODO(PC-25291): enable when its issues are fixed
    'local-rules/no-spacer': 'warn',
    'local-rules/no-ts-expect-error': 'warn',
  },
  archi: {
    'local-rules/no-queries-outside-query-files': 'warn',
    'local-rules/queries-only-in-use-query-functions': 'warn',
    'local-rules/queries-must-be-in-queries-folder': 'warn',
    'boundaries/element-types': ['warn', boundariesRule],
  },
}

const getConditionalRules = (scope, rules) =>
  !process.env.ESLINT_SCOPE || process.env.ESLINT_SCOPE === scope ? rules : {}

module.exports = {
  softRules: Object.entries(softRules).reduce(
    (acc, [scope, rules]) => ({
      ...acc,
      ...getConditionalRules(scope, rules),
    }),
    {}
  ),
}
