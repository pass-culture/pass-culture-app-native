import { renderHook } from '@testing-library/react-hooks'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { offerResponseSnap, offerAdaptedResponseSnap } from '../snaps/offerResponseSnap'
import { useOffer, formatFullAddress } from '../useOffer'

describe('useOffer', () => {
  it('should not call the API if offerId is null', () => {
    const { result } = renderHook(() => useOffer({ offerId: null }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    expect(result.current.isLoading).toBeFalsy()
  })
  it('should call API otherwise', async () => {
    const { result, waitFor } = renderHook(() => useOffer({ offerId: offerResponseSnap.id }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => !result.current.isLoading)
    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerAdaptedResponseSnap))
  })

  it.each`
    publicName              | name            | address               | postalCode   | city         | expectedResult
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
    'should format correctly full address',
    ({ publicName, name, address, postalCode, city, expectedResult }) => {
      expect(formatFullAddress(publicName, name, address, postalCode, city)).toEqual(expectedResult)
    }
  )
})
