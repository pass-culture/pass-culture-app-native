const { RuleTester } = require('eslint')
const rule = require('./no-get-spacing')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
})

ruleTester.run('no-get-spacing', rule, {
  valid: [
    // Existing cases
    { code: `const spacing = theme.designSystem.size.spacing.l;` },
    { code: `const spacing = someOtherFunction(8);` },
    { code: `function getSpacing() { return 10 }` },
    { code: `const spacing = obj.getSpacing();` },

    // Out of range values
    { code: `const padding = getSpacing(13);` },
    { code: `const padding = getSpacing(20);` },

    // Non-literal arguments
    { code: `const padding = getSpacing(value);` },
    { code: `const padding = getSpacing(2 + 2);` },

    // No argument provided
    { code: `const padding = getSpacing();` },
  ],

  invalid: [
    { code: `const padding = getSpacing(0);`, errors: [{ messageId: 'noGetSpacing' }] },
    { code: `const padding = getSpacing(0.25);`, errors: [{ messageId: 'noGetSpacing' }] },
    { code: `const padding = getSpacing(2);`, errors: [{ messageId: 'noGetSpacing' }] },
    { code: `const padding = getSpacing(8.33);`, errors: [{ messageId: 'noGetSpacing' }] },
    { code: `const padding = getSpacing(10.5);`, errors: [{ messageId: 'noGetSpacing' }] },
    { code: `const padding = getSpacing(12);`, errors: [{ messageId: 'noGetSpacing' }] },
    { code: `const padding = getSpacing(12.9);`, errors: [{ messageId: 'noGetSpacing' }] },
    {
      code: `
        const SelectedDay = styled(View)(({ theme }) => ({
          borderRadius: getSpacing(3),
          width: getSpacing(6.5),
        }));
      `,
      errors: [{ messageId: 'noGetSpacing' }, { messageId: 'noGetSpacing' }],
    },
  ],
})
