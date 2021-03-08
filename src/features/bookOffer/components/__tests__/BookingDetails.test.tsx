import { fireEvent, render } from '@testing-library/react-native'
import { act } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises, flushAllPromisesTimes } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BookingDetails } from '../BookingDetails'

const dismissModal = jest.fn()
jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({ bookingState: { quantity: 1 } })),
  useBookingStock: jest.fn(() => ({ price: 2000, id: '123456' })),
  useBookingOffer: jest.fn(() => mockOffer),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

describe('<BookingDetails />', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', async () => {
    const page = await renderBookingDetails()
    expect(page).toMatchSnapshot()
  })

  it('should dismiss modal on successfully booking an offer', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/book_offer', (req, res, ctx) => res(ctx.status(204)))
    )

    const page = await renderBookingDetails()

    await act(async () => {
      await fireEvent.press(page.getByText('Confirmer la réservation'))
    })

    await act(async () => {
      await flushAllPromisesTimes(10)
    })

    await waitForExpect(() => {
      expect(dismissModal).toHaveBeenCalled()
      expect(navigate).toHaveBeenCalledWith('BookingConfirmation')
    })
  })

  it('should show the error snackbar if booking an offer fails', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/book_offer', (req, res, ctx) =>
        res(ctx.status(400), ctx.json({}))
      )
    )

    const page = await renderBookingDetails()

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

const renderBookingDetails = async () => {
  const renderAPI = render(reactQueryProviderHOC(<BookingDetails dismissModal={dismissModal} />))

  await act(flushAllPromises)

  return renderAPI
}
