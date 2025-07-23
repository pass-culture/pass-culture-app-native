import {
  formatFullAddress,
  formatFullAddressStartsWithPostalCode,
} from 'shared/address/addressFormatter'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('@tanstack/react-query').useQuery,
}))

describe('formatFullAddress', () => {
  it.each`
    address               | postalCode   | city         | expected
    ${undefined}          | ${undefined} | ${undefined} | ${''}
    ${undefined}          | ${'75015'}   | ${undefined} | ${'75015'}
    ${undefined}          | ${undefined} | ${'Paris'}   | ${'Paris'}
    ${'2 rue des champs'} | ${undefined} | ${undefined} | ${'2 rue des champs'}
    ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${'2 rue des champs, 75015 Paris'}
    ${'2 rue des champs'} | ${undefined} | ${'Paris'}   | ${'2 rue des champs, Paris'}
    ${'2 rue des champs'} | ${''}        | ${'Paris'}   | ${'2 rue des champs, Paris'}
    ${'2 rue des champs'} | ${'75015'}   | ${undefined} | ${'2 rue des champs, 75015'}
    ${'2 rue des champs'} | ${'75015'}   | ${''}        | ${'2 rue des champs, 75015'}
  `(
    'should format correctly full address = $expected',
    ({ address, postalCode, city, expected }) => {
      expect(formatFullAddress(address, postalCode, city)).toEqual(expected)
    }
  )
})

describe('formatFullAddressStartsWithPostalCode', () => {
  it('should return an empty string when postal code, city and address not defined', () => {
    const formattedAddress = formatFullAddressStartsWithPostalCode(undefined, undefined, undefined)

    expect(formattedAddress).toEqual('')
  })

  describe('should return formatted address', () => {
    it('with only postal code', () => {
      const formattedAddress = formatFullAddressStartsWithPostalCode(undefined, '75000', undefined)

      expect(formattedAddress).toEqual('75000')
    })

    it('with only city', () => {
      const formattedAddress = formatFullAddressStartsWithPostalCode(undefined, undefined, 'Paris')

      expect(formattedAddress).toEqual('Paris')
    })

    it('with only address', () => {
      const formattedAddress = formatFullAddressStartsWithPostalCode(
        '1 rue de la Paix',
        undefined,
        undefined
      )

      expect(formattedAddress).toEqual('1 rue de la Paix')
    })

    it('with postal code and city', () => {
      const formattedAddress = formatFullAddressStartsWithPostalCode(undefined, '75000', 'Paris')

      expect(formattedAddress).toEqual('75000 Paris')
    })

    it('with postal code and address', () => {
      const formattedAddress = formatFullAddressStartsWithPostalCode(
        '1 rue de la Paix',
        '75000',
        undefined
      )

      expect(formattedAddress).toEqual('75000, 1 rue de la Paix')
    })

    it('with city and address', () => {
      const formattedAddress = formatFullAddressStartsWithPostalCode(
        '1 rue de la Paix',
        undefined,
        'Paris'
      )

      expect(formattedAddress).toEqual('Paris, 1 rue de la Paix')
    })

    it('with postal code, city and address', () => {
      const formattedAddress = formatFullAddressStartsWithPostalCode(
        '1 rue de la Paix',
        '75000',
        'Paris'
      )

      expect(formattedAddress).toEqual('75000 Paris, 1 rue de la Paix')
    })
  })
})
