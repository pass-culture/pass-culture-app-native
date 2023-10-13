import * as React from 'react'

import { api } from 'api/api'
import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { initialBookingState, Step } from 'features/bookOffer/context/reducer'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

import { BookingImpossible } from './BookingImpossible'

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockOfferId = favoriteResponseSnap.offer.id

const mockInitialBookingState = initialBookingState
const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    bookingState: { ...mockInitialBookingState, offerId: mockOfferId },
    dismissModal: mockDismissModal,
    dispatch: mockDispatch,
  })),
}))

const mockPostNativeV1SendOfferWebappLinkByEmailofferId = jest.spyOn(
  api,
  'postNativeV1SendOfferWebappLinkByEmailofferId'
)

const mockPostNativeV1SendOfferLinkByPushofferId = jest.spyOn(
  api,
  'postNativeV1SendOfferLinkByPushofferId'
)

describe('<BookingImpossible />', () => {
  beforeAll(() => {
    server.listen()
  })
  afterAll(() => {
    server.resetHandlers()
    server.close()
  })
  describe('When offer is already favorite', () => {
    beforeEach(() => {
      const favoritesResponseWithOfferIn: PaginatedFavoritesResponse = {
        page: 1,
        nbFavorites: 1,
        favorites: [favoriteResponseSnap],
      }
      mockServer.getAPIV1<PaginatedFavoritesResponse>(
        '/native/v1/me/favorites',
        favoritesResponseWithOfferIn
      )
    })
    it('should render without CTAs', async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<BookingImpossible />))

      await screen.findByLabelText('Voir le détail de l’offre')

      expect(screen).toMatchSnapshot()
    })

    it("should log 'BookingImpossibleiOS' on mount", async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<BookingImpossible />))

      await screen.findByLabelText('Voir le détail de l’offre')

      expect(analytics.logBookingImpossibleiOS).toHaveBeenCalledTimes(1)
    })

    it("should dismiss modal when clicking on 'Voir le détail de l’offre'", async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<BookingImpossible />))

      fireEvent.press(await screen.findByText('Voir le détail de l’offre'))

      expect(mockDismissModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('When offer is not yet favorite', () => {
    beforeEach(() => {
      const favoriteResponse: FavoriteResponse = favoriteResponseSnap
      mockServer.postAPIV1('/native/v1/me/favorites', favoriteResponse)
      mockServer.postAPIV1(`/native/v1/send_offer_link_by_push/${mockOfferId}`, {})
      mockServer.postAPIV1(`/native/v1/send_offer_webapp_link_by_email/${mockOfferId}`, {
        favoriteResponse,
      })
    })

    it('should render with CTAs', async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<BookingImpossible />))

      await screen.findByText(
        'Les conditions générales d’utilisation de l’App Store iOS ne permettent pas de réserver cette offre sur l’application.'
      )

      expect(screen).toMatchSnapshot()
    })

    it('should send email/push notification when adding to favorites', async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<BookingImpossible />))

      await act(async () => {
        const addToFavoriteButton = await screen.findByLabelText('Mettre en favoris')

        fireEvent.press(addToFavoriteButton)
      })

      expect(mockPostNativeV1SendOfferWebappLinkByEmailofferId).toHaveBeenCalledWith(mockOfferId)
      expect(mockPostNativeV1SendOfferLinkByPushofferId).toHaveBeenCalledWith(mockOfferId)
    })

    it('should log analytics event when adding to favorites', async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<BookingImpossible />))

      fireEvent.press(screen.getByText('Mettre en favoris'))

      await waitFor(() => {
        expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledTimes(1)
        expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
          from: 'bookingimpossible',
          offerId: mockOfferId,
        })
        expect(mockDismissModal).toHaveBeenCalledTimes(1)
      })
    })

    it('should change booking step from date to confirmation', async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<BookingImpossible />))
      await act(async () => {})

      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'CHANGE_STEP',
        payload: Step.CONFIRMATION,
      })
    })

    it("should dismiss modal when clicking on 'Retourner à l'offre'", async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<BookingImpossible />))
      await act(async () => {})

      fireEvent.press(await screen.findByText('Retourner à l’offre'))

      expect(mockDismissModal).toHaveBeenCalledTimes(1)
    })
  })
})
