import { rest } from 'msw'
import * as React from 'react'
import { QueryClient } from 'react-query'

import { FavoriteResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

import { BookingImpossible } from './BookingImpossible'

// This file is deprecated because of our new strategy of tests
// if you need to add new tests for the BookingImpossible component, add them to the new test file

const mockDismissModal = jest.fn()
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
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

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const offerId = 20

server.use(
  rest.post<FavoriteResponse>(`${env.API_BASE_URL}/native/v1/me/favorites`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(favoriteResponseSnap))
  ),
  rest.post(`${env.API_BASE_URL}/native/v1/send_offer_link_by_push/${offerId}`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),
  rest.post(
    `${env.API_BASE_URL}/native/v1/send_offer_webapp_link_by_email/${offerId}`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json({}))
  )
)

describe('<BookingImpossible />', () => {
  it('should render with CTAs when offer is not yet favorite', async () => {
    renderBookingImpossible()

    await waitFor(() => {
      expect(screen).toMatchSnapshot()
    })
  })

  it('should render without CTAs when offer is favorite', async () => {
    const setup = (queryClient: QueryClient) => {
      queryClient.setQueryData('favorites', {
        favorites: [{ offer: { id: offerId } }],
      })
    }
    renderBookingImpossible(setup)

    expect(screen).toMatchSnapshot()
  })

  it('should have the correct wording when offer is favorite', async () => {
    const setup = (queryClient: QueryClient) => {
      queryClient.setQueryData('favorites', {
        favorites: [{ offer: { id: offerId } }],
      })
    }
    renderBookingImpossible(setup)

    const redirectionToWebsiteWording = screen.queryByText(
      'Rends-toi vite sur le site pass Culture afin de la réserver'
    )

    expect(redirectionToWebsiteWording).toBeTruthy()
  })

  it("should dismiss modal when clicking on 'Retourner à l'offre'", async () => {
    renderBookingImpossible()

    fireEvent.press(screen.getByText('Retourner à l’offre'))

    await waitFor(() => {
      expect(mockDismissModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should log analytics event when adding to favorites', async () => {
    renderBookingImpossible()

    fireEvent.press(screen.getByText('Mettre en favoris'))

    await waitFor(() => {
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledTimes(1)
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
        from: 'bookingimpossible',
        offerId: offerId,
      })
      expect(mockDismissModal).toHaveBeenCalledTimes(1)
    })
  })

  it("should log 'BookingImpossibleiOS' on mount", async () => {
    renderBookingImpossible()

    await waitFor(() => {
      expect(analytics.logBookingImpossibleiOS).toHaveBeenCalledTimes(1)
    })
  })
})

const renderBookingImpossible = (setup?: ((queryClient: QueryClient) => void) | undefined) => {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<BookingImpossible />, setup))
}
