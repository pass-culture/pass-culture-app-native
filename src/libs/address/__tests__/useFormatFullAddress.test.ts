import {
  formatFullAddress,
  formatFullAddressWithVenueName,
} from 'libs/address/useFormatFullAddress'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('@tanstack/react-query').useQuery,
}))

describe('formatFullAddress', () => {
  it.each`
    address               | postalCode   | city         | expected
    ${undefined}          | ${undefined} | ${undefined} | ${''}
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

describe('formatFullAddressWithVenueName', () => {
  it.each`
    publicName              | name            | address               | postalCode   | city         | expected
    ${undefined}            | ${undefined}    | ${undefined}          | ${undefined} | ${undefined} | ${''}
    ${undefined}            | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${'Ciné Pathé, 2 rue des champs, 75015 Paris'}
    ${undefined}            | ${'Ciné Pathé'} | ${undefined}          | ${'75015'}   | ${'Paris'}   | ${'Ciné Pathé, 75015 Paris'}
    ${undefined}            | ${'Ciné Pathé'} | ${undefined}          | ${undefined} | ${'Paris'}   | ${'Ciné Pathé, Paris'}
    ${undefined}            | ${'Ciné Pathé'} | ${undefined}          | ${undefined} | ${undefined} | ${'Ciné Pathé'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${undefined}          | ${'75015'}   | ${'Paris'}   | ${'Pathé beaugrenelle, 75015 Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${undefined}          | ${'75015'}   | ${undefined} | ${'Pathé beaugrenelle, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${undefined}          | ${undefined} | ${'Paris'}   | ${'Pathé beaugrenelle, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${undefined} | ${'Paris'}   | ${'Pathé beaugrenelle, 2 rue des champs, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${undefined} | ${undefined} | ${'Pathé beaugrenelle, 2 rue des champs'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${undefined} | ${'Pathé beaugrenelle, 2 rue des champs, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${undefined} | ${'Paris'}   | ${'Pathé beaugrenelle, 2 rue des champs, Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${'Ciné Pathé, 2 rue des champs, 75015 Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${''}                 | ${'75015'}   | ${'Paris'}   | ${'Ciné Pathé, 75015 Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${''}                 | ${''}        | ${'Paris'}   | ${'Ciné Pathé, Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${''}                 | ${''}        | ${''}        | ${'Ciné Pathé'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${''}                 | ${'75015'}   | ${'Paris'}   | ${'Pathé beaugrenelle, 75015 Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${''}                 | ${'75015'}   | ${''}        | ${'Pathé beaugrenelle, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${''}                 | ${''}        | ${'Paris'}   | ${'Pathé beaugrenelle, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${''}        | ${'Paris'}   | ${'Pathé beaugrenelle, 2 rue des champs, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${''}        | ${''}        | ${'Pathé beaugrenelle, 2 rue des champs'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${''}        | ${'Pathé beaugrenelle, 2 rue des champs, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${''}        | ${'Paris'}   | ${'Pathé beaugrenelle, 2 rue des champs, Paris'}
  `(
    'should format correctly full address with venue name = $expected',
    ({ publicName, name, address, postalCode, city, expected }) => {
      const result = formatFullAddressWithVenueName(address, postalCode, city, publicName, name)
      expect(result).toEqual(expected)
    }
  )
})
