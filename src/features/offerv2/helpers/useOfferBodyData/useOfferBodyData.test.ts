import mockdate from 'mockdate'

import { CategoryIdEnum } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { useOfferBodyData } from 'features/offerv2/helpers/useOfferBodyData/useOfferBodyData'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockSubcategories = placeholderData.subcategories
const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      searchGroups: mockSearchGroups,
    },
  }),
}))

describe('useOfferBodyData', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should return isMultivenueCompatibleOffer', () => {
    const { result } = renderHook(() => useOfferBodyData({ offer: offerResponseSnap }))

    expect(result.current?.isMultivenueCompatibleOffer).toBeFalsy()
  })

  it('should return categoryId', () => {
    const { result } = renderHook(() => useOfferBodyData({ offer: offerResponseSnap }))

    expect(result.current?.categoryId).toEqual(CategoryIdEnum.CINEMA)
  })

  it('should return appLabel', () => {
    const { result } = renderHook(() => useOfferBodyData({ offer: offerResponseSnap }))

    expect(result.current?.appLabel).toEqual('Cinéma plein air')
  })

  it('should return showVenueBanner', () => {
    const { result } = renderHook(() => useOfferBodyData({ offer: offerResponseSnap }))

    expect(result.current?.showVenueBanner).toBeTruthy()
  })

  it('should return shouldDisplayEventDate', () => {
    const { result } = renderHook(() => useOfferBodyData({ offer: offerResponseSnap }))

    expect(result.current?.shouldDisplayEventDate).toBeTruthy()
  })

  it('should return shouldShowAccessibility', () => {
    const { result } = renderHook(() => useOfferBodyData({ offer: offerResponseSnap }))

    expect(result.current?.shouldShowAccessibility).toBeTruthy()
  })

  it('should return venueSectionTitle', () => {
    const { result } = renderHook(() => useOfferBodyData({ offer: offerResponseSnap }))

    expect(result.current?.venueSectionTitle).toEqual('Lieu de l’évènement')
  })

  it('should return capitalizedFormattedDate', () => {
    const { result } = renderHook(() => useOfferBodyData({ offer: offerResponseSnap }))

    expect(result.current?.capitalizedFormattedDate).toEqual('Les 3 et 4 janvier 2021')
  })
})
