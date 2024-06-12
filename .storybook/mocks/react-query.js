/* 
  The goal of this file is to mock react-query useQuery.

  We tried to keep react-query unmocked and provide its Provider
  to the decorators but it breaks the stories:
  "TypeError: Cannot read properties of undefined (reading 'displayName')"

  This is highly inspired from:
  https://storybook.js.org/docs/react/writing-stories/build-pages-with-storybook#mocking-imports
*/

let returnValueDictionary
export function useQuery(key, _queryFn) {
  const queryKey = key.queryKey ? key.queryKey.join('-') : key
  if (returnValueDictionary?.[queryKey]) {
    return {
      data: returnValueDictionary[queryKey],
      refetch: async () => {},
    }
  }
}

export function useQueryDecorator(story, { parameters }) {
  if (parameters?.useQuery) {
    returnValueDictionary = parameters.useQuery
  }
  return story()
}

export const useQueryClient = () => {
    return {
        setQueryData: () => ({})
    }
}

export class QueryCache {}

export class QueryClient {}