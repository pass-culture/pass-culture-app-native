import mockdate from 'mockdate'

import { SubcategoryIdEnum } from 'api/gen'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { getOfferDates } from 'shared/date/getOfferDates'

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
const JANUARY_12_2021 = 1610578800
const JANUARY_21_2021 = 1611183600

describe('getOfferDates', () => {
  beforeAll(() => {
    mockdate.set(new Date(2020, 10, 1))
  })

  it('should return formatted release date for a movie screening offer providing release date', async () => {
    expect(
      getOfferDates({
        subcategoryId: defaultMovieScreeningOffer.offer.subcategoryId,
        dates: [],
        releaseDate: NOVEMBER_12_2020,
      })
    ).toBe('Dès le 12 novembre 2020')
  })

  it('should return formatted release date for a movie screening offer providing release date next year for playlist', async () => {
    expect(
      getOfferDates({
        subcategoryId: defaultMovieScreeningOffer.offer.subcategoryId,
        dates: [],
        releaseDate: JANUARY_12_2021,
        isPlaylist: true,
      })
    ).toBe('Janv. 2021')
  })

  it('should return formatted dates for an offer that is not a movie screening', () => {
    expect(
      getOfferDates({
        subcategoryId: defaultConcertOffer.offer.subcategoryId,
        dates: [NOVEMBER_1_2020, NOVEMBER_12_2020],
        releaseDate: OCTOBER_5_2020,
      })
    ).toBe('Dès le 1er novembre 2020')
  })

  it('should return formatted dates for an offer that is not a movie screening for next year for playlist', () => {
    expect(
      getOfferDates({
        subcategoryId: defaultConcertOffer.offer.subcategoryId,
        dates: [JANUARY_12_2021, JANUARY_21_2021],
        isPlaylist: true,
      })
    ).toBe('Janv. 2021')
  })

  it('should return formatted dates for an offer that is not a movie screening for playlist', () => {
    expect(
      getOfferDates({
        subcategoryId: defaultConcertOffer.offer.subcategoryId,
        dates: [NOVEMBER_1_2020, NOVEMBER_12_2020],
        releaseDate: OCTOBER_5_2020,
        isPlaylist: true,
      })
    ).toBe('Dès le 1er nov.')
  })

  it('should return undefined if no dates or release date are provided', () => {
    expect(
      getOfferDates({ subcategoryId: defaultMovieScreeningOffer.offer.subcategoryId, dates: [] })
    ).toBeUndefined()
  })

  it('should not return a formatted release date if the wrong data type is received', () => {
    expect(
      getOfferDates({
        subcategoryId: defaultMovieScreeningOffer.offer.subcategoryId,
        dates: [],
        releaseDate: NOVEMBER_12_2020.toString(),
      })
    ).toBeUndefined()
  })
})
