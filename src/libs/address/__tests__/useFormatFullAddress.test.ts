import { formatFullAddress } from 'libs/address/useFormatFullAddress'

describe('useOffer', () => {
  it.each`
    publicName              | name            | address               | postalCode   | city         | showVenueBanner | expectedResult
    ${undefined}            | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${false}        | ${'Ciné Pathé, 2 rue des champs, 75015 Paris'}
    ${undefined}            | ${'Ciné Pathé'} | ${undefined}          | ${'75015'}   | ${'Paris'}   | ${false}        | ${'Ciné Pathé, 75015 Paris'}
    ${undefined}            | ${'Ciné Pathé'} | ${undefined}          | ${undefined} | ${'Paris'}   | ${false}        | ${'Ciné Pathé, Paris'}
    ${undefined}            | ${'Ciné Pathé'} | ${undefined}          | ${undefined} | ${undefined} | ${false}        | ${'Ciné Pathé'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${undefined}          | ${'75015'}   | ${'Paris'}   | ${false}        | ${'Pathé beaugrenelle, 75015 Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${undefined}          | ${'75015'}   | ${undefined} | ${false}        | ${'Pathé beaugrenelle, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${undefined}          | ${undefined} | ${'Paris'}   | ${false}        | ${'Pathé beaugrenelle, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${undefined} | ${'Paris'}   | ${false}        | ${'Pathé beaugrenelle, 2 rue des champs, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${undefined} | ${undefined} | ${false}        | ${'Pathé beaugrenelle, 2 rue des champs'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${undefined} | ${false}        | ${'Pathé beaugrenelle, 2 rue des champs, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${undefined} | ${'Paris'}   | ${false}        | ${'Pathé beaugrenelle, 2 rue des champs, Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${false}        | ${'Ciné Pathé, 2 rue des champs, 75015 Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${''}                 | ${'75015'}   | ${'Paris'}   | ${false}        | ${'Ciné Pathé, 75015 Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${''}                 | ${''}        | ${'Paris'}   | ${false}        | ${'Ciné Pathé, Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${''}                 | ${''}        | ${''}        | ${false}        | ${'Ciné Pathé'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${''}                 | ${'75015'}   | ${'Paris'}   | ${false}        | ${'Pathé beaugrenelle, 75015 Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${''}                 | ${'75015'}   | ${''}        | ${false}        | ${'Pathé beaugrenelle, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${''}                 | ${''}        | ${'Paris'}   | ${false}        | ${'Pathé beaugrenelle, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${''}        | ${'Paris'}   | ${false}        | ${'Pathé beaugrenelle, 2 rue des champs, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${''}        | ${''}        | ${false}        | ${'Pathé beaugrenelle, 2 rue des champs'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${''}        | ${false}        | ${'Pathé beaugrenelle, 2 rue des champs, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${''}        | ${'Paris'}   | ${false}        | ${'Pathé beaugrenelle, 2 rue des champs, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${true}         | ${'2 rue des champs, 75015 Paris'}
    ${'Pathé beaugrenelle'} | ${undefined}    | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${true}         | ${'2 rue des champs, 75015 Paris'}
    ${'Pathé beaugrenelle'} | ${''}           | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${true}         | ${'2 rue des champs, 75015 Paris'}
    ${undefined}            | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${true}         | ${'2 rue des champs, 75015 Paris'}
    ${''}                   | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${true}         | ${'2 rue des champs, 75015 Paris'}
    ${undefined}            | ${undefined}    | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${true}         | ${'2 rue des champs, 75015 Paris'}
    ${''}                   | ${''}           | ${'2 rue des champs'} | ${'75015'}   | ${'Paris'}   | ${true}         | ${'2 rue des champs, 75015 Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${undefined} | ${'Paris'}   | ${true}         | ${'2 rue des champs, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${''}        | ${'Paris'}   | ${true}         | ${'2 rue des champs, Paris'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${undefined} | ${true}         | ${'2 rue des champs, 75015'}
    ${'Pathé beaugrenelle'} | ${'Ciné Pathé'} | ${'2 rue des champs'} | ${'75015'}   | ${''}        | ${true}         | ${'2 rue des champs, 75015'}
  `(
    'should format correctly full address',
    ({ publicName, name, address, postalCode, city, showVenueBanner, expectedResult }) => {
      expect(
        formatFullAddress(publicName, name, address, postalCode, city, showVenueBanner)
      ).toEqual(expectedResult)
    }
  )
})
