import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { extractStockDates } from 'features/offer/helpers/extractStockDates/extractStockDates'

describe('extractStockDates', () => {
  it('should return an empty array for an offer without stocks', () => {
    const offer = { ...mockOffer, stocks: [] }
    const result = extractStockDates(offer)

    expect(result).toEqual([])
  })

  it('should return an array of dates for an offer with stocks', () => {
    const offer = {
      ...mockOffer,
      stocks: [
        {
          id: 148409,
          beginningDatetime: '2021-03-02T20:00:00',
          price: 2400,
          isExpired: false,
          isBookable: true,
          isSoldOut: false,
          isForbiddenToUnderage: false,
          features: [],
        },
        {
          id: 148411,
          beginningDatetime: '2021-03-02T10:00:00',
          price: 2400,
          isExpired: false,
          isBookable: false,
          isSoldOut: false,
          isForbiddenToUnderage: false,
          features: [],
        },
      ],
    }
    const result = extractStockDates(offer)

    expect(result).toEqual(['2021-03-02T20:00:00', '2021-03-02T10:00:00'])
  })

  it('should skip stocks without beginningDatetime', () => {
    const offer = {
      ...mockOffer,
      stocks: [
        {
          id: 148409,
          beginningDatetime: '2021-03-02T20:00:00',
          price: 2400,
          isExpired: false,
          isBookable: true,
          isSoldOut: false,
          isForbiddenToUnderage: false,
          features: [],
        },
        {
          id: 148411,
          beginningDatetime: null,
          price: 2400,
          isExpired: false,
          isBookable: false,
          isSoldOut: false,
          isForbiddenToUnderage: false,
          features: [],
        },
        {
          id: 148410,
          beginningDatetime: '2021-03-17T20:00:00',
          isBookable: true,
          price: 2700,
          isExpired: false,
          isForbiddenToUnderage: false,
          isSoldOut: false,
          features: [],
        },
      ],
    }
    const result = extractStockDates(offer)

    expect(result).toEqual(['2021-03-02T20:00:00', '2021-03-17T20:00:00'])
  })
})
