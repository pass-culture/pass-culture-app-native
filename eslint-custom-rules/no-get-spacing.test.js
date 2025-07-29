const { RuleTester } = require('eslint')
const rule = require('./no-get-spacing')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('no-get-spacing', rule, {
  valid: [
    { code: `const spacing = theme.designSystem.size.spacing.l;` },
    { code: `const spacing = someOtherFunction(8);` },
    { code: `function getSpacing() { return 10 }` },
    { code: `const spacing = obj.getSpacing();` },
  ],
  invalid: [
    {
      code: `const padding = getSpacing(2);`,
      errors: [{ messageId: 'noGetSpacing' }],
    },
    {
      code: `
        const SelectedDay = styled(View)(({ theme }) => ({
          borderRadius: getSpacing(3),
          width: getSpacing(6),
        }));
      `,
      errors: [{ messageId: 'noGetSpacing' }, { messageId: 'noGetSpacing' }],
    },
  ],
})
