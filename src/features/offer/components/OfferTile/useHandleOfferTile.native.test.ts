import { CategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { useHandleOfferTile } from 'features/offer/components/OfferTile/useHandleOfferTile'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

describe('useHandleOfferTile', () => {
  it('should prepopulate react-query cache when clicking on offer', async () => {
    const offerId = offerResponseSnap.id
    const { result } = renderHook(useHandleOfferTile, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    result.current.handlePressOffer({
      offer: {
        ...offerResponseSnap,
        categoryId: CategoryIdEnum.MUSIQUE_LIVE,
        offerId,
      },
      analyticsParams: { from: 'home', offerId },
    })

    const queryHash = JSON.stringify(['offer', offerId])
    const query = queryCache.get(queryHash)

    expect(query).not.toBeUndefined()
    expect(query?.state.data).toStrictEqual({
      accessibility: {},
      description: '',
      expenseDomains: [],
      id: offerId,
      image: undefined,
      isDigital: false,
      isDuo: true,
      isReleased: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      name: 'Sous les étoiles de Paris - VF',
      stocks: [],
      subcategoryId: SubcategoryIdEnumv2.CINE_PLEIN_AIR,
      venue: { coordinates: {} },
      isEducational: false,
      metadata: undefined,
    })
  })
})
