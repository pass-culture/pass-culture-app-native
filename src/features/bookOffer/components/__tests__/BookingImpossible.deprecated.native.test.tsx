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
import { superFlushWithAct, fireEvent, render } from 'tests/utils'

import { BookingImpossible } from '../BookingImpossible'

// This file is deprecated because of our new strategy of tests
// if you need to add new tests for the BookingImpossible component, add them to the new test file

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
  it('should render with CTAs when offer is not yet favorite', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { toJSON } = render(reactQueryProviderHOC(<BookingImpossible />))
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render without CTAs when offer is favorite', async () => {
    const setup = (queryClient: QueryClient) => {
      queryClient.setQueryData('favorites', {
        favorites: [{ offer: { id: 20 } }],
      })
    }

    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<BookingImpossible />, setup))

    expect(renderAPI).toMatchSnapshot()
  })

  it('should have the correct wording when offer is favorite', async () => {
    const setup = (queryClient: QueryClient) => {
      queryClient.setQueryData('favorites', {
        favorites: [{ offer: { id: 20 } }],
      })
    }
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { queryByText } = render(reactQueryProviderHOC(<BookingImpossible />, setup))
    const redirectionToWebsiteWording = queryByText(
      'Rends-toi vite sur le site pass Culture afin de la réserver'
    )
    expect(redirectionToWebsiteWording).toBeTruthy()
  })

  it("should dismiss modal when clicking on 'Retourner à l'offre'", () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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

    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<BookingImpossible />, setup))

    fireEvent.press(getByText('Mettre en favoris'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledTimes(1)
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
        from: 'bookingimpossible',
        offerId: 20,
      })
      expect(mockDismissModal).toHaveBeenCalledTimes(1)
    })
  })

  it("should log 'BookingImpossibleiOS' on mount", () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<BookingImpossible />))
    expect(analytics.logBookingImpossibleiOS).toHaveBeenCalledTimes(1)
  })
})
