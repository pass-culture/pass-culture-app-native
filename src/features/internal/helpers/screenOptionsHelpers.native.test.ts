import { getScreenForLabel } from './screenOptionsHelpers'

describe('screenOptionsHelpers', () => {
  describe('getScreenForLabel', () => {
    it('should return the screen for a valid label', () => {
      expect(getScreenForLabel('Home')).toBe('Home')
      expect(getScreenForLabel('Offer')).toBe('Offer')
    })

    it('should return undefined for an invalid label', () => {
      expect(getScreenForLabel('InvalidLabel')).toBeUndefined()
      expect(getScreenForLabel('')).toBeUndefined()
    })
  })
})
