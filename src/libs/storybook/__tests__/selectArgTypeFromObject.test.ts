import { selectArgTypeFromObject } from '../selectArgTypeFromObject'

describe('selectArgTypeFromObject', () => {
  it('returns the select arg type when options object is provided', () => {
    const option1 = 'toto'
    const option2 = 42
    const options = { option1, option2 }

    const selectArgType = {
      options: ['option1', 'option2'],
      mapping: { option1, option2 },
      control: {
        type: 'select',
        labels: { option1: 'option1', option2: 'option2' },
      },
    }

    expect(selectArgTypeFromObject(options)).toEqual(selectArgType)
  })
})
