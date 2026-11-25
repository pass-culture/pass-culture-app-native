// eslint-disable-next-line @typescript-eslint/no-require-imports
const sonarjs = require('eslint-plugin-sonarjs')

const recommendedRules = sonarjs.configs.recommended.rules

const RULES_IGNORED_IN_SONAR_PROJECT_PROPERTIES = [
  'sonarjs/no-empty-test-file',
  'sonarjs/prefer-read-only-props',
  'sonarjs/single-character-alternation',
  'sonarjs/void-use',
]

const RULES_ALREADY_COVERED_BY_OTHER_PLUGINS = [
  'sonarjs/no-duplicate-test-title',
  'sonarjs/no-skipped-tests',
  'sonarjs/no-unused-vars',
]

const AWS_CDK_RULES = Object.keys(recommendedRules).filter((rule) =>
  rule.startsWith('sonarjs/aws-')
)

const SLOW_RULES = ['sonarjs/deprecation']

const RULES_TO_FIX = {
  '@typescript-eslint/await-thenable': 'warn',
  'sonarjs/argument-type': 'warn',
  'sonarjs/cognitive-complexity': 'warn',
  'sonarjs/concise-regex': 'warn',
  'sonarjs/constructor-for-side-effects': 'warn',
  'sonarjs/different-types-comparison': 'warn',
  'sonarjs/fixme-tag': 'warn',
  'sonarjs/function-return-type': 'warn',
  'sonarjs/no-alphabetical-sort': 'warn',
  'sonarjs/no-clear-text-protocols': 'warn',
  'sonarjs/no-empty-collection': 'warn',
  'sonarjs/no-floating-point-equality': 'warn',
  'sonarjs/no-globals-shadowing': 'warn',
  'sonarjs/no-hardcoded-ip': 'warn',
  'sonarjs/no-hardcoded-passwords': 'warn',
  'sonarjs/no-hardcoded-secrets': 'warn',
  'sonarjs/no-internal-api-use': 'warn',
  'sonarjs/no-misleading-array-reverse': 'warn',
  'sonarjs/no-nested-conditional': 'warn',
  'sonarjs/no-nested-template-literals': 'warn',
  'sonarjs/no-redundant-jump': 'warn',
  'sonarjs/no-redundant-optional': 'warn',
  'sonarjs/no-small-switch': 'warn',
  'sonarjs/no-trivial-assertions': 'warn',
  'sonarjs/no-try-promise': 'warn',
  'sonarjs/no-undefined-argument': 'warn',
  'sonarjs/no-unthrown-error': 'warn',
  'sonarjs/parameterized-tests': 'warn',
  'sonarjs/prefer-regexp-exec': 'warn',
  'sonarjs/prefer-single-boolean-return': 'warn',
  'sonarjs/pseudo-random': 'warn',
  'sonarjs/redundant-type-aliases': 'warn',
  'sonarjs/regex-complexity': 'warn',
  'sonarjs/super-linear-regex': 'warn',
  'sonarjs/use-type-alias': 'warn',
}

const disable = (rules) => Object.fromEntries(rules.map((rule) => [rule, 'off']))

const sonarRules = {
  ...recommendedRules,
  ...disable(RULES_IGNORED_IN_SONAR_PROJECT_PROPERTIES),
  ...disable(RULES_ALREADY_COVERED_BY_OTHER_PLUGINS),
  ...disable(AWS_CDK_RULES),
  ...disable(SLOW_RULES),
  ...disable(Object.keys(RULES_TO_FIX)),
}

module.exports = { sonarjs, sonarRules, sonarSoftRules: RULES_TO_FIX }
