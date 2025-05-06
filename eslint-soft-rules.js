const softRules = {
  cleancode: [
    'react/no-unstable-nested-components', // TODO(PC-25291): enable when its issues are fixed
    'local-rules/no-fireEvent',
    'react/no-unused-prop-types', // has false positives
    'local-rules/no-spacer',
    'local-rules/no-ts-expect-error',
  ],
  archi: [
    'local-rules/no-queries-outside-query-files',
    'local-rules/queries-only-in-use-query-functions',
    'local-rules/queries-must-be-in-queries-folder',
  ],
}

const getConditionalRules = (scope, rulesArray) => {
  if (!process.env.ESLINT_SCOPE || process.env.ESLINT_SCOPE === scope) {
    return rulesArray.reduce((acc, rule) => ({ ...acc, [rule]: 'warn' }), {})
  }
  return {}
}

module.exports = {
  softRules: Object.entries(softRules).reduce(
    (acc, [scope, rules]) => ({
      ...acc,
      ...getConditionalRules(scope, rules),
    }),
    {}
  ),
}
