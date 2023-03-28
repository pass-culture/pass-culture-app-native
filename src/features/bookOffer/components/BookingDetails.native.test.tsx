import { rest } from 'msw'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { BookingState, initialBookingState, Step } from 'features/bookOffer/context/reducer'
import { mockDigitalOffer, mockOffer } from 'features/bookOffer/fixtures/offer'
import * as BookingOfferAPI from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { IBookingContext } from 'features/bookOffer/types'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import * as logOfferConversionAPI from 'libs/algolia/analytics/logOfferConversion'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, screen } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BookingDetails, BookingDetailsProps } from './BookingDetails'

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockInitialBookingState = initialBookingState

let mockBookingStock = {
  price: 2000,
  id: 148409,
  beginningDatetime: '2021-03-02T20:00:00',
} as ReturnType<typeof useBookingStock>

const mockOfferId = 1337
const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn()
mockUseBookingContext.mockReturnValue({
  bookingState: { quantity: 1, offerId: mockOfferId } as BookingState,
  dismissModal: mockDismissModal,
  dispatch: mockDispatch,
})
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: jest.fn(() => mockBookingStock),
}))
jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(),
}))
const mockUseBookingOffer = jest.spyOn(BookingOfferAPI, 'useBookingOffer')
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

jest.mock('features/profile/helpers/useIsUserUnderage')
const mockedUseIsUserUnderage = jest.spyOn(UnderageUserAPI, 'useIsUserUnderage')

const mockUseSubcategoriesMapping = jest.fn()
jest.mock('libs/subcategories', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
}))
mockUseSubcategoriesMapping.mockReturnValue({
  EVENEMENT_PATRIMOINE: { isEvent: true },
})

const spyLogOfferConversion = jest.fn()
jest
  .spyOn(logOfferConversionAPI, 'useLogOfferConversion')
  .mockReturnValue({ logOfferConversion: spyLogOfferConversion })

server.use(
  rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/${mockOfferId}`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(offerResponseSnap))
  )
)
const mockOnPressBookOffer = jest.fn()

describe('<BookingDetails />', () => {
  describe('with initial state', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: mockInitialBookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
    })

    it('should initialize correctly state when offer isDigital', async () => {
      mockBookingStock = undefined

      renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 148401 })
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
    })

    it('should initialize the state when offer isDigital only with first bookable stocks', async () => {
      mockBookingStock = undefined
      const mockStocks = [{ ...offerStockResponseSnap, isBookable: false, id: 123456 }]
      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(mockDispatch).not.toHaveBeenCalled()

      const mockOthersStocks = [
        { ...offerStockResponseSnap, isBookable: false, id: 123456 },
        { ...offerStockResponseSnap, isBookable: true, id: 1234567 },
        { ...offerStockResponseSnap, isBookable: true, id: 12345678 },
      ]
      renderBookingDetails({ stocks: mockOthersStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 1234567 })
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
      expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 12345678 })
    })

    it('should not display the Duo selector when the offer is not duo', () => {
      renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })

      expect(screen.queryByTestId('DuoChoiceSelector')).toBeNull()
    })
  })

  describe('when user has selected options', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: { quantity: 1, offerId: mockOfferId } as BookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
    })

    it('should render correctly when offer is an event', () => {
      mockBookingStock = {
        price: 2000,
        id: 148409,
        beginningDatetime: '2021-03-02T20:00:00',
      } as ReturnType<typeof useBookingStock>

      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(screen).toMatchSnapshot()
    })
    it('should render disable CTA when user is underage and stock is forbidden to underage', () => {
      mockBookingStock = {
        price: 2000,
        id: 148409,
        beginningDatetime: '2021-03-02T20:00:00',
        isForbiddenToUnderage: true,
      } as ReturnType<typeof useBookingStock>
      mockedUseIsUserUnderage.mockReturnValueOnce(true)
      renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
      expect(screen).toMatchSnapshot()
    })

    it('should run validation booking when pressing "Confirmer la réservation" button', () => {
      renderBookingDetails({
        stocks: mockStocks,
        onPressBookOffer: mockOnPressBookOffer,
      })
      const ConfirmButton = screen.getByText('Confirmer la réservation')
      fireEvent.press(ConfirmButton)
      expect(mockOnPressBookOffer).toHaveBeenCalledTimes(1)
    })

    it('should not display the loading screen when booking validation is not in progress', () => {
      renderBookingDetails({
        stocks: mockStocks,
        onPressBookOffer: mockOnPressBookOffer,
      })

      expect(screen.queryByTestId('loadingScreen')).toBeNull()
    })

    it('should display the loading screen when booking validation is in progress', () => {
      renderBookingDetails({
        stocks: mockStocks,
        isLoading: true,
        onPressBookOffer: mockOnPressBookOffer,
      })

      expect(screen.getByTestId('loadingScreen')).toBeTruthy()
    })
  })

  it('should change step to confirmation when step is date and offer is not an event', () => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: mockInitialBookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    })
    mockUseBookingOffer.mockReturnValueOnce(mockDigitalOffer)
    renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.CONFIRMATION })
  })

  it('should not change step to confirmation when step is date and offer is an event', async () => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: mockInitialBookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    })
    mockUseBookingOffer.mockReturnValueOnce(mockOffer)
    renderBookingDetails({ stocks: mockStocks, onPressBookOffer: mockOnPressBookOffer })
    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: 'CHANGE_STEP',
      payload: Step.CONFIRMATION,
    })
  })

  describe('duo selector', () => {
    beforeEach(() => {
      const duoBookingState: BookingState = {
        ...mockInitialBookingState,
        quantity: 2,
      }
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: duoBookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
    })

    it('should not display the Duo selector when the offer is duo but is an event', () => {
      mockUseBookingOffer.mockReturnValueOnce({ ...mockOffer, isDuo: true })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        EVENEMENT_PATRIMOINE: { isEvent: true },
      })

      renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })

      expect(screen.queryByTestId('DuoChoiceSelector')).toBeNull()
    })

    it('should display the Duo selector when the offer is duo and not an event', async () => {
      mockUseBookingOffer.mockReturnValueOnce({ ...mockOffer, isDuo: true })

      mockUseSubcategoriesMapping.mockReturnValueOnce({
        EVENEMENT_PATRIMOINE: { isEvent: false },
      })

      renderBookingDetails({ stocks: mockDigitalStocks, onPressBookOffer: mockOnPressBookOffer })

      expect(await screen.findByTestId('DuoChoiceSelector')).toBeTruthy()
    })
  })
})

function renderBookingDetails({
  stocks,
  isLoading = false,
  onPressBookOffer,
}: BookingDetailsProps) {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <BookingDetails stocks={stocks} isLoading={isLoading} onPressBookOffer={onPressBookOffer} />
    )
  )
}
