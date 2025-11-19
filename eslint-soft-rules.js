/* eslint-disable @typescript-eslint/no-var-requires */
const { boundariesRule } = require('./eslint-custom-rules/boundaries-rule')

const softRules = {
  cleancode: {
    'react/no-unstable-nested-components': 'error', // TODO(PC-25291): enable when its issues are fixed
    'local-rules/no-spacer': 'warn',
    'local-rules/no-ts-expect-error': 'warn',
    'local-rules/no-get-spacing': 'warn',
    'local-rules/no-theme-colors': 'warn',
  },
  archi: {
    'boundaries/element-types': ['warn', boundariesRule],
  },
  reactRules: {
    'react-hooks/config': 'warn',
    'react-hooks/error-boundaries': 'warn',
    'react-hooks/component-hook-factories': 'warn',
    'react-hooks/gating': 'warn',
    'react-hooks/globals': 'warn',
    'react-hooks/immutability': 'warn',
    'react-hooks/preserve-manual-memoization': 'warn',
    'react-hooks/purity': 'warn',
    'react-hooks/refs': 'warn',
    'react-hooks/set-state-in-effect': 'warn',
    'react-hooks/set-state-in-render': 'warn',
    'react-hooks/static-components': 'warn',
    'react-hooks/unsupported-syntax': 'warn',
    'react-hooks/incompatible-library': 'warn',
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
