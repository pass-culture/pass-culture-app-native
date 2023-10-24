import { isAddressValid } from './addressCheck'

describe('isAddressValid function', () => {
  it.each([
    '1 ',
    '1',
    '1 rue',
    '1, rue de Loïc-Raison',
    'àâçéèêîôœùûÀÂÇÉÈÊÎÔŒÙÛ',
    '1 rue de l’artillerie',
    "1 rue de l'artillerie",
  ])('should accept a well-formatted address: %s', (address) => {
    const isValid = isAddressValid(address)

    expect(isValid).toEqual(true)
  })

  it.each(['J@hn', 'ჯონ', '𝘑𝘦𝘢𝘯 𝘩𝘦𝘯𝘳𝘺', ' ', '  ', '1() rue de Loïc-Raison'])(
    'should reject a unwell-formatted address: %s',
    (address) => {
      const isValid = isAddressValid(address)

      expect(isValid).toEqual(false)
    }
  )
})
