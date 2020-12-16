import { renderHook } from '@testing-library/react-hooks'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { offerResponseSnap, offerAdaptedResponseSnap } from '../snaps/offerResponseSnap'
import { useOffer, adaptOfferResponse } from '../useOffer'

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

  it('adaptOfferResponse - should add full address', () => {
    //@ts-ignore beginningDatetime is a string corresponding to a Date
    expect(adaptOfferResponse(offerResponseSnap).fullAddress).toEqual(
      'PATHE BEAUGRENELLE, 2 RUE LAMENNAIS 75008 PARIS 8'
    )
    const offerWithoutAddress = {
      ...offerResponseSnap,
      venue: {
        ...offerResponseSnap.venue,
        address: undefined,
      },
    }
    //@ts-ignore beginningDatetime is a string corresponding to a Date
    expect(adaptOfferResponse(offerWithoutAddress).fullAddress).toEqual(
      'PATHE BEAUGRENELLE, 75008 PARIS 8'
    )
    const offerWithPublicName = {
      ...offerResponseSnap,
      venue: {
        ...offerResponseSnap.venue,
        publicName: 'Ciné Pathé',
      },
    }
    //@ts-ignore beginningDatetime is a string corresponding to a Date
    expect(adaptOfferResponse(offerWithPublicName).fullAddress).toEqual(
      'Ciné Pathé, 2 RUE LAMENNAIS 75008 PARIS 8'
    )
  })
})
