import { rest } from 'msw'
import * as React from 'react'

import { api } from 'api/api'
import { FavoriteResponse } from 'api/gen'
import { initialBookingState, Step } from 'features/bookOffer/context/reducer'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, screen } from 'tests/utils'

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

const mockPostnativev1sendOfferWebappLinkByEmailofferId = jest.spyOn(
  api,
  'postnativev1sendOfferWebappLinkByEmailofferId'
)

const mockPostnativev1sendOfferLinkByPushofferId = jest.spyOn(
  api,
  'postnativev1sendOfferLinkByPushofferId'
)

describe('<BookingImpossible />', () => {
  beforeAll(() => {
    const favoriteResponse: FavoriteResponse = favoriteResponseSnap

    server.use(
      rest.post(`${env.API_BASE_URL}/native/v1/me/favorites`, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(favoriteResponse))
      ),
      rest.post(
        `${env.API_BASE_URL}/native/v1/send_offer_link_by_push/${mockOfferId}`,
        (_req, res, ctx) => res(ctx.status(200), ctx.json({}))
      ),
      rest.post(
        `${env.API_BASE_URL}/native/v1/send_offer_webapp_link_by_email/${mockOfferId}`,
        (_req, res, ctx) => res(ctx.status(200), ctx.json({}))
      )
    )
  })

    mockedUseMutation
      // @ts-expect-error ts(2345)
      .mockImplementationOnce(mockUseMutationNotifyWebappLinkSent)
      // @ts-expect-error ts(2345)
      .mockImplementationOnce(useMutationFactory(useMutationAddFavoriteCallbacks))

  it('should send email/push notification when adding to favorites', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<BookingImpossible />))

    await act(async () => {
      const addToFavoriteButton = await screen.findByLabelText('Mettre en favoris')

      fireEvent.press(addToFavoriteButton)
    })

    expect(mockPostnativev1sendOfferWebappLinkByEmailofferId).toHaveBeenCalledWith(mockOfferId)
    expect(mockPostnativev1sendOfferLinkByPushofferId).toHaveBeenCalledWith(mockOfferId)
  })

  it('should change booking step from date to confirmation', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<BookingImpossible />))

    await screen.findByLabelText('Mettre en favoris')

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'CHANGE_STEP',
      payload: Step.CONFIRMATION,
    })
  })
})
