import { splitArrayIntoStrings } from 'shared/splitArrayIntoStrings/splitArrayIntoStrings'

describe('splitArrayIntoStrings', () => {
  it('should split array into strings with specified number of items per string', () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    const maxItemsPerString = 3
    const expectedResult = ['a,b,c', 'd,e,f', 'g']

    const result = splitArrayIntoStrings(array, maxItemsPerString)

    expect(result).toEqual(expectedResult)
  })

  it('should handle empty array', () => {
    const array: string[] = []
    const maxItemsPerString = 3
    const expectedResult: string[] = []

    const result = splitArrayIntoStrings(array, maxItemsPerString)

    expect(result).toEqual(expectedResult)
  })

  it('should handle array length smaller than maxItemsPerString', () => {
    const array = ['a', 'b', 'c']
    const maxItemsPerString = 5
    const expectedResult = ['a,b,c']

    const result = splitArrayIntoStrings(array, maxItemsPerString)

    expect(result).toEqual(expectedResult)
  })

  it('should handle array length exactly equal to maxItemsPerString', () => {
    const array = ['a', 'b', 'c']
    const maxItemsPerString = 3
    const expectedResult = ['a,b,c']

    const result = splitArrayIntoStrings(array, maxItemsPerString)

    expect(result).toEqual(expectedResult)
  })

  it('should handle array length larger than maxItemsPerString', () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    const maxItemsPerString = 2
    const expectedResult = ['a,b', 'c,d', 'e,f', 'g']

    const result = splitArrayIntoStrings(array, maxItemsPerString)

    expect(result).toEqual(expectedResult)
  })
})
