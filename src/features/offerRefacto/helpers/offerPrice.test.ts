import { OfferStockResponse } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import {
  getAllPrices,
  getIsFreeDigitalOffer,
  getIsFreeOffer,
  getPrice,
} from 'features/offerRefacto/helpers'

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

describe('getIsFreeDigitalOffer', () => {
  it('should return false when offer is not defined', () => {
    const isFreeDigitalOffer = getIsFreeDigitalOffer()

    expect(isFreeDigitalOffer).toEqual(false)
  })

  it('should return false when offer is digital and not free', () => {
    const isFreeDigitalOffer = getIsFreeDigitalOffer({
      ...mockOffer,
      isDigital: true,
      stocks: [{ ...mockOffer.stocks[0], price: 100 }],
    })

    expect(isFreeDigitalOffer).toEqual(false)
  })

  it('should return false when offer is not digital and free', () => {
    const isFreeDigitalOffer = getIsFreeDigitalOffer({
      ...mockOffer,
      isDigital: false,
      stocks: [{ ...mockOffer.stocks[0], price: 0 }],
    })

    expect(isFreeDigitalOffer).toEqual(false)
  })

  it('should return false when offer is not digital and not free', () => {
    const isFreeDigitalOffer = getIsFreeDigitalOffer({
      ...mockOffer,
      isDigital: false,
      stocks: [{ ...mockOffer.stocks[0], price: 100 }],
    })

    expect(isFreeDigitalOffer).toEqual(false)
  })

  it('should return true when offer is digital and free', () => {
    const isFreeDigitalOffer = getIsFreeDigitalOffer({
      ...mockOffer,
      isDigital: true,
      stocks: [{ ...mockOffer.stocks[0], price: 0 }],
    })

    expect(isFreeDigitalOffer).toEqual(true)
  })
})

describe('getIsFreeOffer', () => {
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

    expect(getIsFreeOffer(offer)).toBe(true)
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

    expect(getIsFreeOffer(offer)).toBe(true)
  })

  it('returns false if there are no stocks', () => {
    const offer = {
      ...offerResponseSnap,
      stocks: [],
    }

    expect(getIsFreeOffer(offer)).toBe(false)
  })
})
