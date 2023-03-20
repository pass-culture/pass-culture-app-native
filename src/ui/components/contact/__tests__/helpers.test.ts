import { Linking, Platform } from 'react-native'

import { waitFor } from 'tests/utils'
import { openPhoneNumber, isValidFrenchPhoneNumber } from 'ui/components/contact/helpers'

describe('openPhoneNumber', () => {
  const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
  const phoneNumber = '0610203040'

  it('should navigate phone keyboard with "telprompt:" if is iOS device', async () => {
    Platform.OS = 'ios'
    openPhoneNumber(phoneNumber)

    await waitFor(() => {
      expect(openURL).toBeCalledWith(`telprompt:${phoneNumber}`)
    })
  })

  it('should navigate phone keyboard with "tel:" if is Androïd device', async () => {
    Platform.OS = 'android'
    openPhoneNumber(phoneNumber)

    await waitFor(() => {
      expect(openURL).toBeCalledWith(`tel:${phoneNumber}`)
    })
  })
})

describe('isValidFrenchPhoneNumber function', () => {
  it.each([
    // Réunion
    '0692010203',
    '0693010203',
    '0262010203',
    '0263010203',
    '+692010203',
    '+693010203',
    '+262010203',
    '+263010203',

    // Mayotte
    '0269010203',

    // Saint-Pierre and Miquelon
    '0508010203',
    '+508010203',

    // Guadeloupe, Saint-Martin et Saint-Barthélemy
    '0690010203',
    '0691010203',
    '0590010203',
    '+690010203',
    '+691010203',
    '+590010203',

    // French Guiana
    '0694010203',
    '0594010203',
    '+594010203',
    '+594010203',

    // Martinique
    '0696010203',
    '0697010203',
    '0596010203',
    '+696010203',
    '+697010203',
    '+596010203',

    // Wallis-et-Futuna
    '0681010203',

    // New Caledonia
    '0033101020304',
    '00687010203',

    // French Polynesia
    '0689010203',

    // France
    '0601020304',
    '0701020304',
    '0102030405',
    '0033601020304',
    '0033101020304',
    '+33601020304',
    '+33101020304',
  ])('should accept a well formated phone number: %s', (phoneNumber) => {
    const isValid = isValidFrenchPhoneNumber(phoneNumber)

    expect(isValid).toBeTruthy()
  })

  it.each([
    '', // empty
    '01', // too short (min 6)
    '62435463579', // too long (max 10)
    '33224354m', // includes char
  ])('should reject a well formated phone number: %s', (phoneNumber) => {
    const isValid = isValidFrenchPhoneNumber(phoneNumber)

    expect(isValid).toBeFalsy()
  })
})
