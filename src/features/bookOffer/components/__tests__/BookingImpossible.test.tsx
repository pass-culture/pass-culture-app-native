import { fireEvent, render } from '@testing-library/react-native'
import { rest } from 'msw'
import * as React from 'react'
import { QueryClient } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { addFavoriteJsonResponseSnap } from 'features/favorites/api/snaps/favorisResponseSnap'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'

import { BookingImpossible } from '../BookingImpossible'

const mockDismissModal = jest.fn()
jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({
    bookingState: {
      offerId: 20,
      stockId: undefined,
      step: undefined,
      quantity: undefined,
      date: undefined,
    },
    dismissModal: mockDismissModal,
  })),
}))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

server.use(
  rest.post<EmptyResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(addFavoriteJsonResponseSnap))
  )
)

describe('<BookingImpossible />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const { toJSON } = render(reactQueryProviderHOC(<BookingImpossible />))
    expect(toJSON()).toMatchSnapshot()
  })

  it("should dismiss modal when clicking on 'Retourner à l'offre'", () => {
    const { getByText } = render(reactQueryProviderHOC(<BookingImpossible />))
    fireEvent.press(getByText("Retourner à l'offre"))
    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should log analytics event when adding to favorites', async () => {
    const setup = (queryClient: QueryClient) => {
      queryClient.setQueryData('favorites', {
        favorites: [],
      })
    }

    const { getByText } = render(reactQueryProviderHOC(<BookingImpossible />, setup))

    fireEvent.press(getByText('Mettre en favoris'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledTimes(1)
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
        from: 'BookingImpossible',
        offerId: 20,
      })
    })
  })

  it("should log 'BookingImpossibleiOS' on mount", () => {
    render(reactQueryProviderHOC(<BookingImpossible />))
    expect(analytics.logBookingImpossibleiOS).toHaveBeenCalledTimes(1)
  })
})
