import { OfferStockResponse } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import {
  getAllPrices,
  getPrice,
  isFreeDigitalOffer,
  isFreeOffer,
} from 'features/offerRefacto/helpers'

jest.mock('libs/firebase/analytics/analytics')

describe('getAllPrices', () => {
  it('should return all bookable prices if defined', () => {
    const stocks: OfferStockResponse[] = [
      { ...offerStockResponseSnap, price: 400, isBookable: false },
      { ...offerStockResponseSnap, price: 500 },
      { ...offerStockResponseSnap, price: 600 },
    ]

    expect(getAllPrices(stocks)).toEqual([500, 600])
  })

  it('should return all prices if no bookable prices defined', () => {
    const stocks: OfferStockResponse[] = [
      { ...offerStockResponseSnap, price: 400, isBookable: false },
      { ...offerStockResponseSnap, price: 500, isBookable: false },
      { ...offerStockResponseSnap, price: 600, isBookable: false },
    ]

    expect(getAllPrices(stocks)).toEqual([400, 500, 600])
  })
})

describe('getPrice', () => {
  it('should consider bookable stock first', () => {
    const stocks: OfferStockResponse[] = [
      { ...offerStockResponseSnap, price: 400, isBookable: false },
      { ...offerStockResponseSnap, price: 500 }, // selected
      { ...offerStockResponseSnap, price: 600 },
    ]

    expect(getPrice(stocks)).toEqual(500)
  })

  it('should consider all stock if no bookable', () => {
    const stocks: OfferStockResponse[] = [
      { ...offerStockResponseSnap, price: 400, isBookable: false }, // selected
      { ...offerStockResponseSnap, price: 500, isBookable: false },
    ]

    expect(getPrice(stocks)).toEqual(400)
  })
})

describe('isFreeDigitalOffer', () => {
  it('should return false when offer is not defined', () => {
    expect(isFreeDigitalOffer()).toEqual(false)
  })

  it('should return false when offer is digital and not free', () => {
    const isFreeDigitalOfferValue = isFreeDigitalOffer({
      ...mockOffer,
      isDigital: true,
      stocks: [{ ...mockOffer.stocks[0], price: 100 }],
    })

    expect(isFreeDigitalOfferValue).toEqual(false)
  })

  it('should return false when offer is not digital and free', () => {
    const isFreeDigitalOfferValue = isFreeDigitalOffer({
      ...mockOffer,
      isDigital: false,
      stocks: [{ ...mockOffer.stocks[0], price: 0 }],
    })

    expect(isFreeDigitalOfferValue).toEqual(false)
  })

  it('should return false when offer is not digital and not free', () => {
    const isFreeDigitalOfferValue = isFreeDigitalOffer({
      ...mockOffer,
      isDigital: false,
      stocks: [{ ...mockOffer.stocks[0], price: 100 }],
    })

    expect(isFreeDigitalOfferValue).toEqual(false)
  })

  it('should return true when offer is digital and free', () => {
    const isFreeDigitalOfferValue = isFreeDigitalOffer({
      ...mockOffer,
      isDigital: true,
      stocks: [{ ...mockOffer.stocks[0], price: 0 }],
    })

    expect(isFreeDigitalOfferValue).toEqual(true)
  })
})

describe('isFreeOffer', () => {
  it('returns true if there is only free stocks', () => {
    const offer = {
      ...offerResponseSnap,
      stocks: [
        { ...offerResponseSnap.stocks[0], price: 0 },
        { ...offerResponseSnap.stocks[0], price: 0 },
        { ...offerResponseSnap.stocks[0], price: 0 },
        { ...offerResponseSnap.stocks[0], price: 0 },
      ],
    }

    expect(isFreeOffer(offer)).toBe(true)
  })

  it('returns true if there is at least one free stock', () => {
    const offer = {
      ...offerResponseSnap,
      stocks: [
        { ...offerResponseSnap.stocks[0], price: 0 },
        { ...offerResponseSnap.stocks[0], price: 0 },
        { ...offerResponseSnap.stocks[0], price: 100 },
        { ...offerResponseSnap.stocks[0], price: 0 },
      ],
    }

    expect(isFreeOffer(offer)).toBe(true)
  })

  it('returns false if there are no stocks', () => {
    const offer = {
      ...offerResponseSnap,
      stocks: [],
    }

    expect(isFreeOffer(offer)).toBe(false)
  })
})
