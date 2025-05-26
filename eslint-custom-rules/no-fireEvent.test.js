const { RuleTester } = require('eslint')
const rule = require('./no-fireEvent')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-fireEvent', rule, {
  valid: [
    {
      code: 'userEvent.press(button)',
    },
    {
      code: 'userEvent.typeText(input, "text")',
    },
    {
      code: 'userEvent.scroll(scrollView, { y: 100 })',
    },
    {
      code: 'fireEvent.changeText(input, "text")',
      errors: [{ messageId: 'useUserEvent' }],
    },
    {
      code: 'fireEvent.scroll(scrollView, { y: 100 })',
      errors: [{ messageId: 'useUserEvent' }],
    },
  ],

  invalid: [
    {
      code: 'fireEvent.press(button)',
      errors: [{ messageId: 'useUserEvent' }],
    },
  ],
})
