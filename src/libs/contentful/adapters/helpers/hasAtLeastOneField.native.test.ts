import { hasAtLeastOneField } from 'libs/contentful/adapters/helpers/hasAtLeastOneField'

describe('hasAtLeastOneField', () => {
  it('should return true for an object with fields', () => {
    const object = {
      a: 'a',
      b: 'b',
    }

    expect(hasAtLeastOneField(object)).toBeTruthy()
  })
  it('should return false for an object without fields', () => {
    const object = {}

    expect(hasAtLeastOneField(object)).toBeFalsy()
  })
})
