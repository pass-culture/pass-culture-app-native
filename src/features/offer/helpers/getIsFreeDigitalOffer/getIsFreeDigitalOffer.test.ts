import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { getIsFreeDigitalOffer } from 'features/offer/helpers/getIsFreeDigitalOffer/getIsFreeDigitalOffer'

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
