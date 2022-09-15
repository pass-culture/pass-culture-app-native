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
  if (returnValueDictionary?.[key]) {
    return {
      data: returnValueDictionary[key],
    }
  }
}

export function useQueryDecorator(story, { parameters }) {
  if (parameters?.useQuery) {
    returnValueDictionary = parameters.useQuery
  }
  return story()
}
