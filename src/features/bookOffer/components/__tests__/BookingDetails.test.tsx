import { fireEvent, render } from '@testing-library/react-native'
import { act } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferStockResponse } from 'api/gen'
import { mockDigitalOffer, mockOffer } from 'features/bookOffer/fixtures/offer'
import { BookingState, initialBookingState } from 'features/bookOffer/pages/reducer'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises, flushAllPromisesTimes } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BookingDetails } from '../BookingDetails'

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockInitialBookingState = initialBookingState

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest
    .fn(() => ({
      bookingState: { quantity: 1 } as BookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    }))
    .mockImplementationOnce(() => ({
      bookingState: mockInitialBookingState as BookingState,
      dismissModal: mockDismissModal,
      dispatch: mockDispatch,
    })),
  useBookingStock: jest
    .fn(() => ({
      price: 2000,
      id: '148409',
      beginningDatetime: new Date('2021-03-02T20:00:00'),
    }))
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .mockImplementationOnce(() => {}),
  useBookingOffer: jest.fn(() => mockOffer),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const mockStocks = mockOffer.stocks
const mockDigitalStocks = mockDigitalOffer.stocks

describe('<BookingDetails />', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize correctly state when offer isDigital', async () => {
    await renderBookingDetails(mockDigitalStocks)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 148401 })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
  })
  it('should render correctly when user has selected options and offer is an event', async () => {
    const page = await renderBookingDetails(mockStocks)
    expect(page).toMatchSnapshot()
  })
  it('should dismiss modal on successfully booking an offer', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/book_offer', (req, res, ctx) => res(ctx.status(204)))
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
      expect(navigate).toHaveBeenCalledWith('BookingConfirmation')
    })
  })

  it('should show the error snackbar if booking an offer fails', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/book_offer', (req, res, ctx) =>
        res(ctx.status(400), ctx.json({}))
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
    })
  })
})

const renderBookingDetails = async (stocks: OfferStockResponse[]) => {
  const renderAPI = render(reactQueryProviderHOC(<BookingDetails stocks={stocks} />))

  await act(flushAllPromises)

  return renderAPI
}
