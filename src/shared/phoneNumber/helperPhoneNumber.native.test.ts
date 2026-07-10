import { WHITELISTED_COUNTRIES } from 'shared/countries/constants'

import { getCountryIdFromPhoneNumber } from './helperPhoneNumber'

describe('helperPhoneNumber', () => {
  describe('getCountryIdFromPhoneNumber', () => {
    it('returns FR for a french phone number', () => {
      expect(getCountryIdFromPhoneNumber('+33612345678')).toBe('FR')
    })

    it('supports 3-digit calling code prefixes (example +590)', () => {
      const countryId = getCountryIdFromPhoneNumber('+590690123456')
      const country = WHITELISTED_COUNTRIES.find((entry) => entry.id === countryId)

      expect(country?.callingCode).toBe('590')
    })

    it('supports 3-digit calling code prefixes with spaces', () => {
      const countryId = getCountryIdFromPhoneNumber('+590 690 12 34 56')
      const country = WHITELISTED_COUNTRIES.find((entry) => entry.id === countryId)

      expect(country?.callingCode).toBe('590')
    })
  })
})
