import { useMutation } from 'react-query'

export const useFlakyUseQueryMutation = () => {
  return useMutation(() => Promise.resolve('hello'))
}
