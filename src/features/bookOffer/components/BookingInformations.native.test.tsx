import React from 'react'

import {
  OfferResponse,
  OfferStockResponse,
  OffersStocksResponse,
  ScreeningFeatures,
  SubcategoryIdEnum,
} from 'api/gen'
import { initialBookingState } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { QueryKeys } from 'libs/queryKeys'
import { mockServer } from 'tests/mswServer'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

import { BookingInformations } from './BookingInformations'

const randomDatetime = '2020-12-01T00:00:00Z'
const offerId = baseOffer.id
const screeningStockId = offerStockResponseSnap.id

jest.mock('features/bookOffer/context/useBookingContext')
jest.mock('features/bookOffer/helpers/useBookingStock')
jest.mock('libs/hooks/useLogTypeFromRemoteConfig', () => ({
  useLogTypeFromRemoteConfig: () => ({ logType: 'ignored' }),
}))

const mockedUseBooking = jest.mocked(useBookingContext)
const mockedUseBookingStock = jest.mocked(useBookingStock)

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

const defaultStock: OfferStockResponse = {
  ...offerStockResponseSnap,
  beginningDatetime: randomDatetime,
  price: 11,
  activationCode: { expirationDate: randomDatetime },
}

let offer: OfferResponse | undefined = cinePleinAirOffer
let bookingState: typeof initialBookingState = { ...initialBookingState, quantity: 2 }
let stock: OfferStockResponse | undefined = defaultStock

const mockOffersStocks = (screeningFeatures: ScreeningFeatures | null = emptyScreeningFeatures) => {
  mockServer.postApi<OffersStocksResponse>('/v3/offers/stocks', {
    offers: [
      {
        venue: { timezone: 'UTC' },
        stocks: [
          {
            id: screeningStockId,
            price: 11,
            beginningDatetime: randomDatetime,
            isBookable: true,
            isExpired: false,
            isForbiddenToUnderage: false,
            isSoldOut: false,
            screeningFeatures,
          },
        ],
      },
    ],
  } as OffersStocksResponse)
}

const renderBookingInformations = () => render(reactQueryProviderHOC(<BookingInformations />))

describe('<BookingInformations />', () => {
  beforeEach(() => {
    setFeatureFlags()
    offer = cinePleinAirOffer
    bookingState = { ...initialBookingState, quantity: 2 }
    stock = { ...defaultStock }
    mockUseBookingOffer.mockImplementation(() => offer)
    mockedUseBooking.mockImplementation(() => ({
      bookingState,
      dispatch: () => null,
      dismissModal: () => null,
    }))
    mockedUseBookingStock.mockImplementation(() => stock)
  })

  it('should return empty component when no offer', () => {
    offer = undefined
    renderBookingInformations()

    expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
  })

  it('should return empty component when no stock', () => {
    stock = undefined
    renderBookingInformations()

    expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
  })

  it('should return empty component when no quantity', () => {
    bookingState = { ...initialBookingState, quantity: undefined }
    renderBookingInformations()

    expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
  })

  it('should render event date section when event', async () => {
    renderBookingInformations()

    expect(
      await screen.findByText('Mardi 1er décembre 2020 à 00h00 - Durée : 1h')
    ).toBeOnTheScreen()
  })

  it('should display `Gratuit` if price is 0', async () => {
    stock = { ...defaultStock, price: 0 }
    renderBookingInformations()

    expect(await screen.findByText('Gratuit')).toBeOnTheScreen()
  })

  it('should display unique price when quantity is unique', async () => {
    bookingState = { ...initialBookingState, quantity: 1 }
    renderBookingInformations()

    expect(await screen.findByText('0,11 €')).toBeOnTheScreen()
  })

  it('should display stock label when the offer has it', () => {
    stock = { ...defaultStock, price: 1200, priceCategoryLabel: 'A stock label' }

    renderBookingInformations()

    expect(screen.getByTestId('price-line-label')).toBeOnTheScreen()
  })

  it("shouldn't display stock label when the offer hasn't any", () => {
    bookingState = { ...initialBookingState, quantity: 1 }
    stock = { ...defaultStock, price: 1200, priceCategoryLabel: undefined }

    renderBookingInformations()

    expect(screen.queryByTestId('price-line-label')).not.toBeOnTheScreen()
  })

  it('should display the screening language when the stock has one', async () => {
    bookingState = { ...initialBookingState, offerId, stockId: screeningStockId, quantity: 1 }
    stock = { ...defaultStock, price: 1200 }
    mockOffersStocks({ ...emptyScreeningFeatures, language: 'VOSTFR' })

    renderBookingInformations()

    expect(await screen.findByTestId('price-line-attributes')).toHaveTextContent(/VOSTFR/)
  })

  it("shouldn't display a screening language when the stock has none", async () => {
    bookingState = { ...initialBookingState, offerId, stockId: screeningStockId, quantity: 1 }
    stock = { ...defaultStock, price: 1200 }
    mockOffersStocks(emptyScreeningFeatures)

    renderBookingInformations()

    await waitFor(() => {
      const screeningQuery = queryCache
        .getAll()
        .find((cachedQuery) => cachedQuery.queryKey[0] === QueryKeys.OFFER_STOCKS_SPECIAL_EVENT)

      expect(screeningQuery?.state.status).toBe('success')
    })

    expect(screen.getByText('12\u00a0€')).toBeOnTheScreen()
    expect(screen.queryByTestId('price-line-attributes')).not.toBeOnTheScreen()
  })

  it('should display screening tags when the stock has screening features', async () => {
    bookingState = { ...initialBookingState, offerId, stockId: screeningStockId, quantity: 1 }
    mockOffersStocks({ ...emptyScreeningFeatures, specialEventType: 'AVANT_PREMIERE' })

    renderBookingInformations()

    expect(await screen.findByText('Avant-première')).toBeOnTheScreen()
  })

  it('should display expirationDate section when offer is digital and has expirationDate', async () => {
    offer = carteCineOfferDigital
    renderBookingInformations()

    expect(await screen.findByText('À activer avant le 1er décembre 2020')).toBeOnTheScreen()
  })

  it("shouldn't display expirationDate section when offer is digital and has no expirationDate", async () => {
    offer = carteCineOfferDigital
    stock = { ...defaultStock, price: 0, activationCode: null }
    renderBookingInformations()

    await screen.findByText('Gratuit')

    expect(screen.queryByText('À activer avant le 1er décembre 2020')).not.toBeOnTheScreen()
  })

  it('should display only date if it has no duration information', async () => {
    offer = {
      ...cinePleinAirOffer,
      extraData: { durationMinutes: null },
    }

    renderBookingInformations()

    expect(await screen.findByText('Mardi 1er décembre 2020 à 00h00')).toBeOnTheScreen()
  })
})
