const { RuleTester } = require('eslint')

const rule = require('./query-hooks-must-return-use-query-result')

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
})

ruleTester.run('query-hooks-must-return-use-query-result', rule, {
  valid: [
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        function useUserQuery() {
          return useQuery({ queryKey: ['user'], queryFn: fetchUser })
        }
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useUserQuery = () => {
          return useQuery({ queryKey: ['user'], queryFn: fetchUser })
        }
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useUserQuery = () => useQuery({ queryKey: ['user'], queryFn: fetchUser })
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useUserQuery = () => {
          return usePersistQuery({ queryKey: ['user'], queryFn: fetchUser })
        }
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useUserQuery = (): UseQueryResult<User> => {
          return useQuery({ queryKey: ['user'], queryFn: fetchUser })
        }
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useBannerQuery = (hasGeolocPosition: boolean) => {
          return useQuery({
            queryKey: ['HOME_BANNER', hasGeolocPosition],
            queryFn: () => api.getNativeV1Banner(hasGeolocPosition),
          })
        }
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useOfferQuery = ({ offerId, select }) => {
          const queryClient = useQueryClient()
          const query = useQuery({
            queryKey: ['OFFER', offerId],
            queryFn: async () => {
              const offer = await getOfferById(offerId)
              queryClient.setQueryData(['OFFER', 'PREVIEW', offerId], false)
              return offer
            },
            select,
          })
          return query
        }
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useBookingsV2WithConvertedTimezoneQuery = (enabled: boolean) =>
          useBookingsQuery(enabled, (data) => convertOffererDatesToTimezone(data))
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useSpecialUserQuery = () => {
          return useUserQuery({ userId: 123 })
        }
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useConditionalQuery = (condition) => {
          const queryA = useQuery({ queryKey: ['a'], queryFn: fetchA })
          const queryB = useQuery({ queryKey: ['b'], queryFn: fetchB })
          return condition ? queryA : queryB
        }
      `,
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        function useSetPersistQuery(query, queryKey) {
          useEffect(() => {
            if (!query.isLoading && query.data) {
              AsyncStorage.setItem(String(queryKey), JSON.stringify(query.data))
            }
          }, [query.data, query.isLoading, queryKey])
        }
      `,
    },
    {
      code: `
        const useUser = () => {
          return { data: null }
        }
      `,
    },
    {
      code: `
        const useUserData = () => {
          return { data: null }
        }
      `,
    },
    {
      code: `
        const fetchQuery = () => {
          return { data: null }
        }
      `,
    },
    {
      code: `
        const useMediaQuery = ({ minWidth }) => {
          const { width } = useWindowDimensions()
          return width >= minWidth
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        function useUserQuery() {
          return { data: null }
        }
      `,
      errors: [{ messageId: 'mustReturnUseQuery', data: { name: 'useUserQuery' } }],
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useUserQuery = () => {
          return { data: null }
        }
      `,
      errors: [{ messageId: 'mustReturnUseQuery', data: { name: 'useUserQuery' } }],
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useUserQuery = () => {
          const result = useQuery({ queryKey: ['user'], queryFn: fetchUser })
          return result.data
        }
      `,
      errors: [{ messageId: 'mustReturnUseQuery', data: { name: 'useUserQuery' } }],
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useUserQuery = () => {
          return { user: null, loading: false }
        }
      `,
      errors: [{ messageId: 'mustReturnUseQuery', data: { name: 'useUserQuery' } }],
    },
    {
      code: `
        import { useQuery } from '@tanstack/react-query'
        const useUserQuery = () => {
          useQuery({ queryKey: ['user'], queryFn: fetchUser })
        }
      `,
      errors: [{ messageId: 'mustReturnUseQuery', data: { name: 'useUserQuery' } }],
    },
  ],
})

