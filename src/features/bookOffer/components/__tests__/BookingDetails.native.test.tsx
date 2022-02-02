import { rest } from 'msw'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferStockResponse } from 'api/gen'
import { mockDigitalOffer, mockOffer } from 'features/bookOffer/fixtures/offer'
import { useBookingOffer, useBookingStock } from 'features/bookOffer/pages/BookingOfferWrapper'
import { BookingState, initialBookingState } from 'features/bookOffer/pages/reducer'
import { notExpiredStock } from 'features/offer/services/useCtaWordingAndAction.testsFixtures'
import { useIsUserUnderage } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { campaignTracker, CampaignEvents } from 'libs/campaign'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises, flushAllPromisesTimes, act, fireEvent, render } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BookingDetails } from '../BookingDetails'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockInitialBookingState = initialBookingState

const mockOfferId = 1337
let mockBookingState = {
  bookingState: { quantity: 1, offerId: mockOfferId } as BookingState,
  dismissModal: mockDismissModal,
  dispatch: mockDispatch,
}
let mockBookingStock = {
  price: 2000,
  id: 148409,
  beginningDatetime: '2021-03-02T20:00:00',
} as ReturnType<typeof useBookingStock>

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => mockBookingState),
  useBookingStock: jest.fn(() => mockBookingStock),
  useBookingOffer: jest.fn(),
}))
const mockUseBookingOffer = mocked(useBookingOffer)
mockUseBookingOffer.mockReturnValue({ ...mockOffer, isDuo: false })

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

const mockStocks = mockOffer.stocks
const mockDigitalStocks = mockDigitalOffer.stocks

jest.mock('features/profile/utils')
const mockedUseIsUserUnderage = mocked(useIsUserUnderage)

const mockUseSubcategoriesMapping = jest.fn()
jest.mock('libs/subcategories', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
}))
mockUseSubcategoriesMapping.mockReturnValue({
  EVENEMENT_PATRIMOINE: { isEvent: true },
})

describe('<BookingDetails />', () => {
  it('should initialize correctly state when offer isDigital', async () => {
    mockBookingState = {
      bookingState: mockInitialBookingState as BookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    }
    mockBookingStock = undefined

    await renderBookingDetails(mockDigitalStocks)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 148401 })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
  })

  it('should initialize the state when offer isDigital only with first bookable stocks', async () => {
    mockBookingState = {
      bookingState: mockInitialBookingState as BookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    }
    mockBookingStock = undefined

    await renderBookingDetails([{ ...notExpiredStock, isBookable: false, id: 123456 }])
    expect(mockDispatch).not.toHaveBeenCalled()

    await renderBookingDetails([
      { ...notExpiredStock, isBookable: false, id: 123456 },
      { ...notExpiredStock, isBookable: true, id: 1234567 },
      { ...notExpiredStock, isBookable: true, id: 12345678 },
    ])
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 1234567 })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
    expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 12345678 })
  })

  it('should render correctly when user has selected options and offer is an event', async () => {
    mockBookingState = {
      bookingState: { quantity: 1, offerId: mockOfferId } as BookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    }
    mockBookingStock = {
      price: 2000,
      id: 148409,
      beginningDatetime: '2021-03-02T20:00:00',
    } as ReturnType<typeof useBookingStock>

    const page = await renderBookingDetails(mockStocks)
    expect(page).toMatchSnapshot()
  })
  it('should render disable CTA when user is underage and stock is forbidden to underage', async () => {
    mockBookingStock = {
      price: 2000,
      id: 148409,
      beginningDatetime: '2021-03-02T20:00:00',
      isForbiddenToUnderage: true,
    } as ReturnType<typeof useBookingStock>
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    const page = await renderBookingDetails(mockStocks)
    expect(page).toMatchSnapshot()
  })

  it('should dismiss modal on successfully booking an offer', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) => res(ctx.status(204)))
    )

    const page = await renderBookingDetails(mockStocks)

    await act(async () => {
      await fireEvent.press(page.getByText('Confirmer la réservation'))
    })

    await act(async () => {
      await flushAllPromisesTimes(10)
    })

    await waitForExpect(() => {
      expect(mockDismissModal).toHaveBeenCalled()
      expect(analytics.logBookingConfirmation).toHaveBeenCalledWith(mockOfferId, undefined)
      expect(campaignTracker.logEvent).toHaveBeenCalledWith(CampaignEvents.COMPLETE_BOOK_OFFER, {
        af_offer_id: mockOffer.id,
        af_booking_id: mockBookingStock?.id,
        af_price: mockBookingStock?.price,
        af_category: mockOffer.subcategoryId,
      })
      expect(navigate).toHaveBeenCalledWith('BookingConfirmation', { offerId: mockOfferId })
    })
  })

  it.each`
    code                     | message
    ${undefined}             | ${'En raison d’une erreur technique, l’offre n’a pas pu être réservée'}
    ${'INSUFFICIENT_CREDIT'} | ${'Attention, ton crédit est insuffisant pour pouvoir réserver cette offre\u00a0!'}
    ${'ALREADY_BOOKED'}      | ${'Attention, il est impossible de réserver plusieurs fois la même offre\u00a0!'}
    ${'STOCK_NOT_BOOKABLE'}  | ${'Oups, cette offre n’est plus disponible\u00a0!'}
  `(
    'should show the error snackbar with message="$message" for errorCode="$code" if booking an offer fails',
    async ({ code, message }: { code: string | undefined; message: string }) => {
      const response = code ? { code } : {}

      server.use(
        rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) =>
          res(ctx.status(400), ctx.json(response))
        )
      )

      const page = await renderBookingDetails(mockStocks)

      await act(async () => {
        await fireEvent.press(page.getByText('Confirmer la réservation'))
      })

      await act(async () => {
        await flushAllPromisesTimes(10)
      })

      await waitForExpect(() => {
        expect(mockShowErrorSnackBar).toHaveBeenCalledTimes(1)
        expect(mockShowErrorSnackBar).toHaveBeenCalledWith({ timeout: 5000, message })
        if (code) {
          expect(analytics.logBookingError).toHaveBeenCalledTimes(1)
          expect(analytics.logBookingError).toHaveBeenCalledWith(mockOfferId, code)
        } else {
          expect(analytics.logBookingError).not.toHaveBeenCalled()
        }
      })
    }
  )

  describe('duo selector', () => {
    it('should not display the Duo selector when the offer is not duo', async () => {
      mockBookingState = {
        bookingState: mockInitialBookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      }

      const { queryByTestId } = await renderBookingDetails(mockDigitalStocks)

      expect(queryByTestId('DuoChoiceSelector')).toBeFalsy()
    })

    it('should not display the Duo selector when the offer is duo but is an event', async () => {
      mockUseBookingOffer.mockReturnValueOnce({ ...mockOffer, isDuo: true })

      const duoBookingState: BookingState = { ...mockInitialBookingState, quantity: 2 }
      mockBookingState = {
        bookingState: duoBookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      }

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        EVENEMENT_PATRIMOINE: { isEvent: true },
      })

      const { queryByTestId } = await renderBookingDetails(mockDigitalStocks)

      expect(queryByTestId('DuoChoiceSelector')).toBeFalsy()
    })

    it('should display the Duo selector when the offer is duo and not an event', async () => {
      mockUseBookingOffer.mockReturnValueOnce({ ...mockOffer, isDuo: true })

      const duoBookingState: BookingState = { ...mockInitialBookingState, quantity: 2 }
      mockBookingState = {
        bookingState: duoBookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      }

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        EVENEMENT_PATRIMOINE: { isEvent: false },
      })

      const { queryByTestId } = await renderBookingDetails(mockDigitalStocks)

      expect(queryByTestId('DuoChoiceSelector')).toBeTruthy()
    })
  })
})

const renderBookingDetails = async (stocks: OfferStockResponse[]) => {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  const renderAPI = render(reactQueryProviderHOC(<BookingDetails stocks={stocks} />))

  await act(flushAllPromises)

  return renderAPI
}
