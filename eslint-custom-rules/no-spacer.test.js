const { RuleTester } = require('eslint')
const rule = require('./no-spacer')
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})
ruleTester.run('no-spacer', rule, {
  valid: [
    { code: '<Spacer.TopScreen />' },
    { code: '<Spacer.BottomScreen />' },
    { code: '<Spacer.TabBar />' },
  ],
  invalid: [
    {
      code: '<Spacer.Column numberOfSpaces={2} />',
      errors: [{ messageId: 'noSpacerColumn' }],
    },
    {
      code: '<Spacer.Row numberOfSpaces={4} />',
      errors: [{ messageId: 'noSpacerRow' }],
    },
    {
      code: '<Spacer.Flex flex={1} />',
      errors: [{ messageId: 'noSpacerFlex' }],
    },
  ],
})

