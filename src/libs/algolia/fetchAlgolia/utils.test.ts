import { parseAndCleanStringsToNumbers } from 'libs/algolia/fetchAlgolia/utils'

describe('utils', () => {
  it('should parseStringsToNumbers', () => {
    const result = parseAndCleanStringsToNumbers([
      '123456',
      '3.14',
      '0',
      '-123',
      '  56  ',
      'abc',
      '',
      '  ',
      'NaN',
      'Infinity',
      'null',
      'undefined',
      'true',
      'false',
    ])

    expect(result).toEqual([123456, 3.14, -123, 56])
  })
})
