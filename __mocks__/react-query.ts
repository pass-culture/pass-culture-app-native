const invalidateQueries = jest.fn()

export class QueryCache {
  clear() {}
}
export class QueryClient {}

export const QueryClientProvider = (component: React.ReactNode) => {
  return component
}

export const useMutation = jest.fn().mockImplementation((mutationFunction, mutationOptions) => ({
  mutationFunction,
  mutationOptions,
  mutate: () => {},
}))
export const useQueryClient = jest.fn().mockReturnValue({ invalidateQueries, getQueryData: () => {}})

export const useQuery = jest.fn().mockResolvedValue({})
