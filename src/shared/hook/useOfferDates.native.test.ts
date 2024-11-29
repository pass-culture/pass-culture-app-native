import mockdate from 'mockdate'

import { SubcategoryIdEnum } from 'api/gen'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { useOfferDates } from './useOfferDates'

const mockOffer = mockedAlgoliaResponse.hits[0]
const defaultOfferName = 'La petite sirène'
const defaultMovieScreeningOffer = {
  ...mockOffer,
  offer: {
    subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
    name: defaultOfferName,
  },
}

const defaultConcertOffer = {
  ...mockOffer,
  offer: {
    subcategoryId: SubcategoryIdEnum.CONCERT,
    name: defaultOfferName,
  },
}

const OCTOBER_5_2020 = 1601856000
const NOVEMBER_1_2020 = 1604188800
const NOVEMBER_12_2020 = 1605139200

describe('useOfferDates', () => {
  beforeAll(() => {
    mockdate.set(new Date(2020, 10, 1))
  })

  it('should return formatted release date for a movie screening offer providing release date', async () => {
    const { result } = renderUseOfferDates({
      ...defaultMovieScreeningOffer,
      offer: {
        ...defaultMovieScreeningOffer.offer,
        releaseDate: NOVEMBER_12_2020,
        dates: [],
      },
    })

    expect(result.current).toBe('Dès le 12 novembre 2020')
  })

  it('should return formatted dates for an offer that is not a movie screening', () => {
    const { result } = renderUseOfferDates({
      ...defaultConcertOffer,
      offer: {
        ...defaultConcertOffer.offer,
        releaseDate: OCTOBER_5_2020,
        dates: [NOVEMBER_1_2020, NOVEMBER_12_2020],
      },
    })

    expect(result.current).toBe('Dès le 1 novembre 2020')
  })

  it('should return undefined if no dates or release date are provided', () => {
    const { result } = renderUseOfferDates({
      ...defaultMovieScreeningOffer,
      offer: {
        ...defaultMovieScreeningOffer.offer,
        dates: [],
      },
    })

    expect(result.current).toBeUndefined()
  })

  it('should NOT return a formatted release date if the wrong data type is received', () => {
    const { result } = renderUseOfferDates({
      ...defaultMovieScreeningOffer,
      offer: {
        ...defaultMovieScreeningOffer.offer,
        releaseDate: NOVEMBER_12_2020.toString(),
        dates: [],
      },
    })

    expect(result.current).toBeUndefined()
  })
})

const renderUseOfferDates = (offer: Offer) =>
  renderHook(() => useOfferDates(offer), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
