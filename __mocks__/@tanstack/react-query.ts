/* eslint-disable @typescript-eslint/no-empty-function */
import { mockedBookingsResponse } from '../fixtures/booking'

const invalidateQueries = jest.fn()
const removeQueries = jest.fn()

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

const getQueryState = (key: string) => {
  switch (key) {
    case 'bookings':
      return { data: mockedBookingsResponse }
    default:
      return {}
  }
}

export const useQueryClient = jest.fn().mockReturnValue({
  invalidateQueries,
  removeQueries,
  getQueryData: () => {},
  setQueryData: () => {},
  getQueryState,
})

export const useQuery = jest.fn().mockResolvedValue({})
