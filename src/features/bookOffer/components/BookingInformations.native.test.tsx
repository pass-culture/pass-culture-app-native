import React from 'react'

import {
  OffersStocksResponse,
  OfferResponse,
  ScreeningFeatures,
  StockResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { initialBookingState } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

import { BookingInformations } from './BookingInformations'

const randomDatetime = '2020-12-01T00:00:00Z'
const offerId = baseOffer.id
const stockId = 118929

jest.mock('features/bookOffer/context/useBookingContext')

const mockedUseBooking = jest.mocked(useBookingContext)

jest.mock('queries/subcategories/useSubcategoriesQuery')

const cinePleinAirOffer = {
  ...baseOffer,
  isDigital: false,
  subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
}

const carteCineOfferDigital = {
  ...baseOffer,
  subcategoryId: SubcategoryIdEnum.CARTE_CINE_ILLIMITE,
  isDigital: true,
}

const mockUseBookingOffer = jest.fn((): OfferResponse | undefined => cinePleinAirOffer)
jest.mock('queries/offer/useBookingOfferQuery', () => ({
  useBookingOfferQuery: () => mockUseBookingOffer(),
}))

const emptyScreeningFeatures: ScreeningFeatures = {
  accessibility: { audio: [], mental: [], motor: [], visual: [] },
  audio: null,
  language: null,
  specialEventType: null,
  video: null,
}

// This line checks that there is no text content rendered. The regex /./ matches any character, so queryByText will return null if there is no content.
const ANY_CHARACTER = /./

const setOffer = (offer: OfferResponse | undefined) => {
  mockUseBookingOffer.mockReturnValue(offer)
}

const setBookingState = (bookingState: typeof initialBookingState) => {
  mockedUseBooking.mockReturnValue({
    bookingState,
    dispatch: () => null,
    dismissModal: () => null,
  })
}

describe('<BookingInformations />', () => {
  beforeEach(() => {
    setFeatureFlags()
    setBookingState({ ...initialBookingState, offerId, stockId, quantity: 2 })
    mockOffersStocks()
  })

  it('should return empty component when no offer', async () => {
    setOffer(undefined)
    renderBookingInformations()

    await waitFor(() => {
      expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
    })
  })

  it('should return empty component when no stock', async () => {
    mockOffersStocks([])
    renderBookingInformations()

    await waitFor(() => {
      expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
    })
  })

  it('should return empty component when no quantity', async () => {
    setBookingState({ ...initialBookingState, offerId, stockId, quantity: undefined })
    renderBookingInformations()

    await waitFor(() => {
      expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
    })
  })

  it('should render event date section when event', async () => {
    setOffer(cinePleinAirOffer)
    renderBookingInformations()

    expect(
      await screen.findByText('Mardi 1er décembre 2020 à 00h00 - Durée : 1h')
    ).toBeOnTheScreen()
  })

  it('should display `Gratuit` if price is 0', async () => {
    setOffer(cinePleinAirOffer)
    mockOffersStocks([
      stockResponse({
        price: 0,
        activationCode: { expirationDate: randomDatetime },
      }),
    ])
    renderBookingInformations()

    expect(await screen.findByText('Gratuit')).toBeOnTheScreen()
  })

  it('should display unique price when quantity is unique', async () => {
    setOffer(cinePleinAirOffer)

    setBookingState({ ...initialBookingState, offerId, stockId, quantity: 1 })
    renderBookingInformations()

    expect(await screen.findByText('0,11 €')).toBeOnTheScreen()
  })

  it('should display stock label when the offer has it', async () => {
    setOffer(cinePleinAirOffer)
    mockOffersStocks([
      stockResponse({
        price: 1200,
        priceCategoryLabel: 'A stock label',
      }),
    ])

    renderBookingInformations()

    expect(await screen.findByTestId('price-line-label')).toBeOnTheScreen()
  })

  it("shouldn't display stock label when the offer hasn't any", async () => {
    setOffer(cinePleinAirOffer)
    setBookingState({ ...initialBookingState, offerId, stockId, quantity: 1 })
    mockOffersStocks([
      stockResponse({
        price: 1200,
        priceCategoryLabel: undefined,
      }),
    ])

    renderBookingInformations()

    await screen.findByText('12\u00a0€')

    expect(screen.queryByTestId('price-line-label')).not.toBeOnTheScreen()
  })

  it('should display the screening language when the stock has one', async () => {
    setOffer(cinePleinAirOffer)
    setBookingState({ ...initialBookingState, offerId, stockId, quantity: 1 })
    mockOffersStocks([
      stockResponse({
        price: 1200,
        screeningFeatures: { ...emptyScreeningFeatures, language: 'VOSTFR' },
      }),
    ])

    renderBookingInformations()

    expect(await screen.findByTestId('price-line-attributes')).toHaveTextContent(/VOSTFR/)
  })

  it("shouldn't display a screening language when the stock has none", async () => {
    setOffer(cinePleinAirOffer)
    setBookingState({ ...initialBookingState, offerId, stockId, quantity: 1 })
    mockOffersStocks([
      stockResponse({
        price: 1200,
        screeningFeatures: emptyScreeningFeatures,
      }),
    ])

    renderBookingInformations()

    await screen.findByText('12\u00a0€')

    expect(screen.queryByTestId('price-line-attributes')).not.toBeOnTheScreen()
  })

  it('should display expirationDate section when offer is digital and has expirationDate', async () => {
    setOffer(carteCineOfferDigital)
    renderBookingInformations()

    expect(await screen.findByText('À activer avant le 1er décembre 2020')).toBeOnTheScreen()
  })

  it("shouldn't display expirationDate section when offer is digital and has no expirationDate", async () => {
    setOffer(carteCineOfferDigital)
    mockOffersStocks([
      stockResponse({
        price: 0,
        activationCode: null,
      }),
    ])
    renderBookingInformations()

    await screen.findByText('Gratuit')

    expect(screen.queryByText('À activer avant le 1er décembre 2020')).not.toBeOnTheScreen()
  })

  it('should display only date if it has no duration information', async () => {
    mockOffersStocks([stockResponse()])
    setOffer({
      ...cinePleinAirOffer,
      extraData: { durationMinutes: null },
    })

    renderBookingInformations()

    expect(await screen.findByText('Mardi 1er décembre 2020 à 00h00')).toBeOnTheScreen()
  })
})

const renderBookingInformations = () => render(reactQueryProviderHOC(<BookingInformations />))

const stockResponse = (stock: Partial<StockResponse> = {}): StockResponse => ({
  id: stockId,
  price: 11,
  beginningDatetime: randomDatetime,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  activationCode: { expirationDate: randomDatetime },
  screeningFeatures: emptyScreeningFeatures,
  ...stock,
})

const mockOffersStocks = (stocks: StockResponse[] = [stockResponse()]) => {
  mockServer.postApi<OffersStocksResponse>('/v3/offers/stocks', {
    offers: [
      {
        venue: { timezone: 'UTC' },
        stocks,
      },
    ],
  } as OffersStocksResponse)
}
