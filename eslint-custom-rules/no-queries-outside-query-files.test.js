const { RuleTester } = require('eslint')
const rule = require('./no-queries-outside-query-files')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-queries-outside-query-files', rule, {
  valid: [
    {
      code: 'const { data } = useQuery()',
      filename: 'src/api/offerQuery.ts',
    },
    {
      code: 'const { data } = useQuery()',
      filename: 'src/api/bookingQuery.ts',
    },
    {
      code: 'const { mutate } = useMutation()',
      filename: 'src/api/offerMutation.ts',
    },
    {
      code: 'const { mutate } = useMutation()',
      filename: 'src/api/bookingMutation.ts',
    },
    {
      code: 'const { data } = useOtherHook()',
      filename: 'src/components/Offer.tsx',
    },
  ],

  invalid: [
    {
      code: 'const { data } = useQuery()',
      filename: 'src/components/Offer.tsx',
      errors: [
        {
          message: 'useQuery can only be used in files ending with *Query.ts',
        },
      ],
    },
    {
      code: 'const { data } = useQuery()',
      filename: 'src/pages/Home.tsx',
      errors: [
        {
          message: 'useQuery can only be used in files ending with *Query.ts',
        },
      ],
    },
    {
      code: 'const { mutate } = useMutation()',
      filename: 'src/components/Offer.tsx',
      errors: [
        {
          message: 'useMutation can only be used in files ending with *Mutation.ts',
        },
      ],
    },
    {
      code: 'const { mutate } = useMutation()',
      filename: 'src/pages/Home.tsx',
      errors: [
        {
          message: 'useMutation can only be used in files ending with *Mutation.ts',
        },
      ],
    },
  ],
})
