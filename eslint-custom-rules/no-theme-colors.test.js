const { RuleTester } = require('eslint')
const rule = require('./no-theme-colors')

const ruleTester = new RuleTester()

ruleTester.run('no-theme-color', rule, {
  valid: [
    {
      code: 'theme.designSystem.color.primary',
    },
    {
      code: 'theme.breakpoints',
    },
    {
      code: 'theme.buttons',
    },
  ],
  invalid: [
    {
      code: 'theme.colors.white',
      errors: [{ messageId: 'noThemeColors' }],
    },
  ],
})
