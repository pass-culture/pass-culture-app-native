import React, { ComponentProps } from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { BookingsResponse, BookOfferResponse, OfferResponseV2 } from 'api/gen'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { mockSubcategory, mockSubcategoryNotEvent } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockedBookingApi } from 'fixtures/booking'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderAsync, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

jest.mock('queries/subcategories/useSubcategoriesQuery')

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

const offerId = offerResponseSnap.id

const offerDigitalAndFree = {
  isDigital: true,
  stocks: [
    {
      id: 118929,
      beginningDatetime: '2021-01-04T13:30:00',
      price: 0,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      features: [],
    },
  ],
}

const offerNotEventCTAButtonProps = {
  offer: offerResponseSnap,
  trackEventHasSeenOfferOnce: jest.fn(),
  subcategory: mockSubcategoryNotEvent,
}
const offerEventCTAButtonProps = {
  offer: offerResponseSnap,
  trackEventHasSeenOfferOnce: jest.fn(),
  subcategory: mockSubcategory,
}

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.mock('features/offer/store/freeOfferIdStore', () => ({
  freeOfferIdActions: {
    resetFreeOfferId: jest.fn(),
  },
  useFreeOfferId: jest.fn(),
}))

describe('<OfferCTAButton />', () => {
  beforeEach(() => {
    mockAuthContextWithoutUser({ persist: true })
    setFeatureFlags()
    mockServer.getApi<BookingsResponse>(`/v1/bookings`, {})
    mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, {
      responseOptions: { data: offerResponseSnap },
    })
  })

  it('should open booking modal when login after booking attempt', async () => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    const fromOfferId = 1
    const openModalOnNavigation = true
    useRoute.mockReturnValueOnce({ params: { fromOfferId, openModalOnNavigation } })
    await renderOfferCTAButton(offerNotEventCTAButtonProps)

    await screen.findByText('Réserver l’offre')

    expect(await screen.findByText('Valider la date')).toBeOnTheScreen()
  })

  it('should display authentication modal when clicking on "Réserver l’offre"', async () => {
    await renderOfferCTAButton(offerNotEventCTAButtonProps)

    await user.press(screen.getByText('Réserver l’offre'))

    expect(
      screen.getByText('Identifie-toi pour découvrir tout ce que la culture a en réserve pour toi.')
    ).toBeOnTheScreen()
  })

  it('should log analytics when display authentication modal', async () => {
    await renderOfferCTAButton(offerNotEventCTAButtonProps)

    await user.press(screen.getByText('Réserver l’offre'))

    expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(1, offerId)
  })

  describe('When offer is digital and free and not already booked', () => {
    const expectedResponse: BookingsResponse = {
      ended_bookings: [],
      hasBookingsAfter18: false,
      ongoing_bookings: [
        {
          ...mockedBookingApi,
          stock: {
            ...mockedBookingApi.stock,
            offer: { ...mockedBookingApi.stock.offer, ...offerDigitalAndFree },
          },
          dateUsed: '2023-02-14T10:10:08.800599Z',
          completedUrl: 'https://www.google.fr/',
        },
      ],
    }

    describe('When booking API response is success', () => {
      beforeEach(() => {
        mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
        mockServer.getApi<BookingsResponse>('/v1/bookings', expectedResponse)
        mockServer.postApi<BookOfferResponse>(`/v1/bookings`, { bookingId: 123 })
      })

      it('should directly book and redirect to the offer when pressing button to book the offer if offer digital and free', async () => {
        mockAuthContextWithUser(beneficiaryUser, { persist: true })

        await renderOfferCTAButton({
          ...offerNotEventCTAButtonProps,
          offer: { ...offerResponseSnap, ...offerDigitalAndFree },
          subcategory: mockSubcategoryNotEvent,
        })

        await user.press(await screen.findByText('Accéder à l’offre en ligne'))

        await waitFor(() => {
          expect(mockedOpenUrl).toHaveBeenNthCalledWith(1, 'https://www.google.fr/')
        })
      })

      it('should log BookingConfirmation when pressing button to book the offer', async () => {
        mockAuthContextWithUser(beneficiaryUser, { persist: true })

        await renderOfferCTAButton({
          ...offerNotEventCTAButtonProps,
          offer: { ...offerResponseSnap, ...offerDigitalAndFree },
        })

        await user.press(await screen.findByText('Accéder à l’offre en ligne'))

        jest.advanceTimersByTime(500)

        await waitFor(() => {
          expect(analytics.logBookingConfirmation).toHaveBeenNthCalledWith(1, {
            bookingId: '123',
            offerId: '116656',
          })
        })
      })
    })

    describe('When booking API response is error', () => {
      beforeEach(() => {
        mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
        mockServer.getApi<BookingsResponse>('/v1/bookings', {
          responseOptions: { data: expectedResponse },
        })
        mockServer.postApi<BookOfferResponse>(`/v1/bookings`, {
          responseOptions: {
            statusCode: 400,
          },
        })
      })

      it('should not direclty redirect to the offer when pressing button to book the offer', async () => {
        mockAuthContextWithUser(beneficiaryUser, { persist: true })

        await renderOfferCTAButton({
          ...offerNotEventCTAButtonProps,
          offer: { ...offerResponseSnap, ...offerDigitalAndFree },
        })

        await user.press(screen.getByText('Accéder à l’offre en ligne'))

        expect(mockedOpenUrl).not.toHaveBeenCalled()
      })

      it('should not log BookingConfirmation when pressing button to book the offer', async () => {
        mockAuthContextWithUser(beneficiaryUser, { persist: true })

        await renderOfferCTAButton({
          ...offerNotEventCTAButtonProps,
          offer: { ...offerResponseSnap, ...offerDigitalAndFree },
        })

        await user.press(screen.getByText('Accéder à l’offre en ligne'))

        expect(analytics.logBookingConfirmation).not.toHaveBeenCalled()
      })
    })

    it('should display an error message when pressing button to book the offer', async () => {
      mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
      mockServer.getApi<BookingsResponse>('/v1/bookings', {
        responseOptions: { data: expectedResponse },
      })
      mockServer.postApi<BookOfferResponse>(`/v1/bookings`, {
        responseOptions: {
          statusCode: 400,
        },
      })
      mockAuthContextWithUser(beneficiaryUser, { persist: true })

      await renderOfferCTAButton({
        ...offerNotEventCTAButtonProps,
        offer: { ...offerResponseSnap, ...offerDigitalAndFree },
      })

      await user.press(screen.getByText('Accéder à l’offre en ligne'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(
        screen.getByText('Désolé, il est impossible d’ouvrir le lien. Réessaie plus tard.')
      ).toBeOnTheScreen()
    })
  })

  describe('When offer is digital and free and already booked', () => {
    const expectedResponse: BookingsResponse = {
      ended_bookings: [],
      hasBookingsAfter18: false,
      ongoing_bookings: [
        {
          ...mockedBookingApi,
          stock: {
            ...mockedBookingApi.stock,
            offer: { ...mockedBookingApi.stock.offer, ...offerDigitalAndFree },
          },
          dateUsed: '2023-02-14T10:10:08.800599Z',
          completedUrl: 'https://www.google.fr/',
        },
      ],
    }

    it('should directly redirect to the offer when pressing offer access button', async () => {
      mockServer.getApi<BookingsResponse>(`/v1/bookings`, expectedResponse)
      mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
      mockAuthContextWithUser(
        { ...beneficiaryUser, bookedOffers: { 116656: 123 } },
        { persist: true }
      )

      await renderOfferCTAButton({
        ...offerNotEventCTAButtonProps,
        offer: { ...offerResponseSnap, ...offerDigitalAndFree },
      })
      const bookingOfferButton = screen.getByText('Accéder à l’offre en ligne')

      await user.press(bookingOfferButton)

      expect(mockedOpenUrl).toHaveBeenCalledTimes(1)
    })

    describe('and is Event', () => {
      it('should not open bookings details modal when pressing offer access button', async () => {
        mockServer.getApi<BookingsResponse>(`/v1/bookings`, expectedResponse)
        mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
        mockAuthContextWithUser(
          { ...beneficiaryUser, bookedOffers: { 116656: 123 } },
          { persist: true }
        )

        await renderOfferCTAButton({
          ...offerEventCTAButtonProps,
          offer: { ...offerResponseSnap, ...offerDigitalAndFree },
        })
        const bookingOfferButton = screen.getByText('Voir ma réservation')

        await user.press(bookingOfferButton)

        expect(screen.queryByText('Valider la date')).not.toBeOnTheScreen()
      })
    })
  })
})

type RenderOfferCTAButtonType = Partial<ComponentProps<typeof OfferCTAButton>>

const renderOfferCTAButton = async ({
  offer = offerResponseSnap,
  subcategory = mockSubcategoryNotEvent,
  trackEventHasSeenOfferOnce = jest.fn(),
}: RenderOfferCTAButtonType) => {
  return renderAsync(
    reactQueryProviderHOC(
      <OfferCTAButton
        offer={offer}
        trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
        subcategory={subcategory}
      />
    )
  )
}
