const { RuleTester } = require('eslint')
const rule = require('./queries-only-in-use-query-functions')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('queries-only-in-use-query-functions', rule, {
  valid: [
    {
      code: `
        function useGetDataQuery() {
          useQuery()
        }
      `,
    },
    {
      code: `
        const useGetDataQuery = () => {
          useQuery()
        }
      `,
    },
    {
      code: `
        const useGetDataQuery = function() {
          useQuery()
        }
      `,
    },
    {
      code: `
        function useQuery() {
          // Ceci est une fonction nommée useQuery, pas un appel à useQuery
        }
      `,
    },
    {
      code: `
        function useUpdateDataMutation() {
          useMutation()
        }
      `,
    },
    {
      code: `
        const useUpdateDataMutation = () => {
          useMutation()
        }
      `,
    },
    {
      code: `
        const useUpdateDataMutation = function() {
          useMutation()
        }
      `,
    },
    {
      code: `
        function useMutation() {
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        function getData() {
          useQuery()
        }
      `,
      errors: [{ messageId: 'forbiddenUseQuery' }],
    },
    {
      code: `
        const getData = () => {
          useQuery()
        }
      `,
      errors: [{ messageId: 'forbiddenUseQuery' }],
    },
    {
      code: `
        const getData = function() {
          useQuery()
        }
      `,
      errors: [{ messageId: 'forbiddenUseQuery' }],
    },
    {
      code: `
        function useGetData() {
          useQuery()
        }
      `,
      errors: [{ messageId: 'forbiddenUseQuery' }],
    },
    {
      code: `
        function getDataQuery() {
          useQuery()
        }
      `,
      errors: [{ messageId: 'forbiddenUseQuery' }],
    },
    {
      code: `
        function updateData() {
          useMutation()
        }
      `,
      errors: [{ messageId: 'forbiddenUseMutation' }],
    },
    {
      code: `
        const updateData = () => {
          useMutation()
        }
      `,
      errors: [{ messageId: 'forbiddenUseMutation' }],
    },
    {
      code: `
        const updateData = function() {
          useMutation()
        }
      `,
      errors: [{ messageId: 'forbiddenUseMutation' }],
    },
    {
      code: `
        function useUpdateData() {
          useMutation()
        }
      `,
      errors: [{ messageId: 'forbiddenUseMutation' }],
    },
    {
      code: `
        function updateDataMutation() {
          useMutation()
        }
      `,
      errors: [{ messageId: 'forbiddenUseMutation' }],
    },
    {
      code: `
        const useGetDataQuery = () => {
          useMutation()
        }
      `,
      errors: [{ messageId: 'forbiddenUseMutation' }],
    },
    {
      code: `
        const useUpdateDataMutation = () => {
          useQuery()
        }
      `,
      errors: [{ messageId: 'forbiddenUseQuery' }],
    },
  ],
})
