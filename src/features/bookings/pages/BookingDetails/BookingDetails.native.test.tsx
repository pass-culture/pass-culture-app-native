import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import {
  BookingReponse,
  BookingResponse,
  BookingsResponse,
  BookingsResponseV2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
  TicketDisplayEnum,
  WithdrawalTypeEnum,
} from 'api/gen'
import { bookingsSnap, bookingsSnapV2 } from 'features/bookings/fixtures'
import * as bookingPropertiesAPI from 'features/bookings/helpers/getBookingProperties'
import * as ongoingOrEndedBookingAPI from 'features/bookings/queries/useOngoingOrEndedBookingQuery'
import { Booking } from 'features/bookings/types'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { BookingDetails as BookingDetailsDefault } from './BookingDetails'

const BookingDetails = withAsyncErrorBoundary(BookingDetailsDefault)

jest.mock('features/auth/context/AuthContext')

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.useFakeTimers()

jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

const mockShowInfoSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  ...jest.requireActual('ui/components/snackBar/SnackBarContext'),
  useSnackBarContext: jest.fn(() => ({
    showInfoSnackBar: mockShowInfoSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  })),
}))

let mockBookings: BookingsResponse = { ...bookingsSnap }

jest.mock('queries/bookings/useBookingsQuery', () => ({
  useBookingsQueryV1: jest.fn(() => ({
    data: mockBookings,
  })),
}))

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()

describe('BookingDetails', () => {
  let ongoingBookings: BookingReponse = bookingsSnap.ongoing_bookings[0]
  let endedBookings: BookingReponse = bookingsSnap.ended_bookings[0]
  let ongoingBookingV2: BookingResponse = bookingsSnapV2.ongoingBookings[0]

  beforeEach(() => {
    ongoingBookings = bookingsSnap.ongoing_bookings[0]
    endedBookings = bookingsSnap.ended_bookings[0]
    ongoingBookingV2 = bookingsSnapV2.ongoingBookings[0]

    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  })

  describe('OldBookingDetails : when FF WIP_NEW_BOOKING_PAGE is off', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    afterEach(() => {
      mockBookings = { ...bookingsSnap }
    })

    beforeAll(() => {
      useRoute.mockImplementation(() => ({
        params: {
          id: 456,
        },
      }))
    })

    it('should call useOngoingOrEndedBooking with the right parameters', async () => {
      const useOngoingOrEndedBooking = jest.spyOn(
        ongoingOrEndedBookingAPI,
        'useOngoingOrEndedBookingQueryV1'
      )

      renderBookingDetails(ongoingBookings)

      await screen.findByText('Ma réservation')

      expect(useOngoingOrEndedBooking).toHaveBeenCalledWith(456)
    })

    it('should render correctly', async () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
      booking.completedUrl = 'https://example.com'
      renderBookingDetails(booking)

      await screen.findByText('Ma réservation')

      expect(screen).toMatchSnapshot()
    })

    describe('<DetailedBookingTicket />', () => {
      it('should display booking token', async () => {
        renderBookingDetails(ongoingBookings)

        await screen.findByText('Ma réservation')

        expect(await screen.findByText('352UW4')).toBeOnTheScreen()
      })

      it('should display offer link button if offer is digital and open url on press', async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] =
          structuredClone(ongoingBookings)
        booking.stock.offer.isDigital = true
        booking.completedUrl = 'https://example.com'

        renderBookingDetails(booking)

        const offerButton = screen.getByText('Accéder à l’offre en ligne')
        await user.press(offerButton)

        expect(mockedOpenUrl).toHaveBeenCalledWith(
          booking.completedUrl,
          {
            analyticsData: {
              offerId: booking.stock.offer.id,
            },
          },
          true
        )
      })

      it('should not display offer link button if no url', async () => {
        renderBookingDetails(ongoingBookings)

        await screen.findByText('Ma réservation')

        expect(screen.queryByText('Accéder à l’offre')).not.toBeOnTheScreen()
      })

      it('should display booking qr code if offer is physical', async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] =
          structuredClone(ongoingBookings)
        booking.stock.offer.isDigital = false
        renderBookingDetails(booking)

        await screen.findByText('Ma réservation')

        expect(await screen.findByTestId('qr-code')).toBeOnTheScreen()
      })

      it('should display EAN code if offer is a book (digital or physical)', async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] =
          structuredClone(ongoingBookings)
        booking.stock.offer.subcategoryId = SubcategoryIdEnum.LIVRE_PAPIER
        renderBookingDetails(booking)

        await screen.findByText('Ma réservation')

        expect(await screen.findByText('123456789')).toBeOnTheScreen()
      })
    })

    describe('Offer rules', () => {
      it('should display rules for a digital offer', async () => {
        const booking = structuredClone(ongoingBookings)
        booking.stock.offer.isDigital = true

        renderBookingDetails(booking)

        await screen.findByText('Ma réservation')

        expect(
          await screen.findByText(
            'Ce code à 6 caractères est ta preuve d’achat\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
          )
        ).toBeOnTheScreen()
      })

      it('should display rules for a digital offer with activation code', async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] =
          structuredClone(ongoingBookings)
        booking.stock.offer.isDigital = true
        booking.activationCode = {
          code: 'fdfdfsds',
        }

        renderBookingDetails(booking)

        await screen.findByText('Ma réservation')

        expect(
          await screen.findByText(
            'Ce code est ta preuve d’achat, il te permet d’accéder à ton offre\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
          )
        ).toBeOnTheScreen()
      })

      it.each([
        ['event', true, WithdrawalTypeEnum.on_site],
        ['physical', false, null],
      ])(
        'should display rules for a %s & non-digital offer',
        async (type, isEvent, withdrawalType) => {
          let booking: BookingsResponse['ongoing_bookings'][number] =
            structuredClone(ongoingBookings)

          booking = {
            ...booking,
            stock: { ...booking.stock, offer: { ...booking.stock.offer, withdrawalType } },
          }
          jest
            .spyOn(bookingPropertiesAPI, 'getBookingProperties')
            .mockReturnValue({ isEvent, isDigital: false, isPhysical: !isEvent })

          renderBookingDetails(booking)

          await screen.findByText('Ma réservation')

          expect(
            await screen.findByText(
              'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce code à 6 caractères. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
            )
          ).toBeOnTheScreen()
        }
      )
    })

    describe('withdrawalDetails', () => {
      it('should display withdrawal details', async () => {
        ongoingBookings.stock.offer.withdrawalDetails = 'Voici comment récupérer ton bien'

        renderBookingDetails(ongoingBookings)

        await screen.findByText('Modalités de retrait')

        expect(screen.getByText('Voici comment récupérer ton bien')).toBeOnTheScreen()
      })

      it('should not display withdrawal details', async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] = ongoingBookings

        booking.stock.offer.withdrawalDetails = undefined
        renderBookingDetails(booking)
        await screen.findByText('Ma réservation')

        const title = screen.queryByText('Modalités de retrait')
        const withdrawalText = screen.queryByTestId('withdrawalDetails')

        expect(title).not.toBeOnTheScreen()
        expect(withdrawalText).not.toBeOnTheScreen()
      })
    })

    describe('booking email contact', () => {
      it('should display booking email contact when there is a booking contact email', async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] = ongoingBookings
        booking.stock.offer.bookingContact = 'bookingContactTest@email.com'
        renderBookingDetails(booking)
        await screen.findByText('Ma réservation')

        expect(screen.getByText('Contact de l’organisateur')).toBeOnTheScreen()
        expect(screen.getByText('bookingContactTest@email.com')).toBeOnTheScreen()
      })

      it('should not display booking email contact when there is no booking contact email', async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] = ongoingBookings
        booking.stock.offer.bookingContact = undefined
        renderBookingDetails(booking)
        await screen.findByText('Ma réservation')

        expect(screen.queryByText("Contact de l'organisateur")).not.toBeOnTheScreen()
      })

      it("should open mail app and log ClickEmailOrganizer when clicking on Venue's mail address", async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] = ongoingBookings
        booking.stock.offer.bookingContact = 'bookingContactTest@email.com'
        renderBookingDetails(booking)
        await screen.findByText('Ma réservation')

        await user.press(screen.getByText('bookingContactTest@email.com'))

        expect(analytics.logClickEmailOrganizer).toHaveBeenCalledTimes(1)

        expect(mockedOpenUrl).toHaveBeenCalledWith(
          `mailto:bookingContactTest@email.com`,
          undefined,
          true
        )
      })
    })

    it('should redirect to the Offer page and log event', async () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = ongoingBookings
      renderBookingDetails(booking)

      const text = screen.getByText('Voir le détail de l’offre')

      await user.press(text)

      const offerId = booking.stock.offer.id

      expect(navigate).toHaveBeenCalledWith('Offer', {
        id: offerId,
        from: 'bookingdetails',
      })
      expect(analytics.logConsultOffer).toHaveBeenCalledWith({ offerId, from: 'bookings' })
    })

    it('should not redirect to the Offer and showSnackBarError when not connected', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })

      renderBookingDetails(ongoingBookings)

      const text = screen.getByText('Voir le détail de l’offre')

      await user.press(text)

      const offerId = ongoingBookings.stock.offer.id

      expect(navigate).not.toHaveBeenCalledWith('Offer', {
        id: offerId,
        from: 'bookingdetails',
      })
      expect(analytics.logConsultOffer).not.toHaveBeenCalledWith({ offerId, from: 'bookings' })
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: `Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    describe('cancellation button', () => {
      it('should log event "CancelBooking" when cancelling booking', async () => {
        const booking: BookingsResponse['ongoing_bookings'][number] =
          structuredClone(ongoingBookings)
        const date = new Date()
        date.setDate(date.getDate() + 1)
        booking.confirmationDate = date.toISOString()
        renderBookingDetails(booking)

        const cancelButton = screen.getAllByTestId('Annuler ma réservation')[0]

        if (cancelButton) {
          await user.press(cancelButton)
        }

        expect(analytics.logCancelBooking).toHaveBeenCalledWith(booking.stock.offer.id)
      })
    })

    describe('cancellation message', () => {
      it('should not display it and not navigate when booking is digital without expiration date', async () => {
        renderBookingDetails(endedBookings)
        await screen.findByText('Ma réservation')

        expect(mockShowInfoSnackBar).not.toHaveBeenCalled()
        expect(navigate).not.toHaveBeenCalled()
      })

      describe('should display it and navigate to bookings', () => {
        beforeEach(() => {
          useRoute.mockImplementation(() => ({
            params: {
              id: 321,
            },
          }))
        })

        it('when booking is digital with expiration date', async () => {
          const booking: BookingsResponse['ongoing_bookings'][number] = {
            ...endedBookings,
            expirationDate: '2021-03-17T23:01:37.925926',
          }

          mockBookings = {
            ...mockBookings,
            ended_bookings: [booking],
          }

          const nameCanceledBooking = booking.stock.offer.name
          renderBookingDetails(booking)

          await screen.findByText('Ma réservation')

          expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
            message: `Ta réservation "${nameCanceledBooking}" a été annulée`,
            timeout: SNACK_BAR_TIME_OUT,
          })
          expect(navigate).toHaveBeenCalledWith('Bookings')
        })

        it('when booking is not digital with expiration date', async () => {
          const booking: BookingsResponse['ongoing_bookings'][number] = {
            ...endedBookings,
            expirationDate: '2021-03-17T23:01:37.925926',
            stock: {
              ...endedBookings.stock,
              offer: { ...endedBookings.stock.offer, isDigital: false },
            },
          }

          mockBookings = {
            ...mockBookings,
            ended_bookings: [booking],
          }

          const nameCanceledBooking = booking.stock.offer.name
          renderBookingDetails(booking)

          await screen.findByText('Ma réservation')

          expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
            message: `Ta réservation "${nameCanceledBooking}" a été annulée`,
            timeout: SNACK_BAR_TIME_OUT,
          })
          expect(navigate).toHaveBeenCalledWith('Bookings')
        })

        it('when booking is not digital without expiration date', async () => {
          const booking = {
            ...endedBookings,
            expirationDate: null,
            stock: {
              ...endedBookings.stock.offer,
              offer: { ...endedBookings.stock.offer, isDigital: false },
              price: 400,
              priceCategoryLabel: 'Cat 4',
              features: ['VOSTFR', '3D', 'IMAX'],
            },
          }

          mockBookings = {
            ...mockBookings,
            ended_bookings: [booking],
          }

          const nameCanceledBooking = booking.stock.offer.name

          renderBookingDetails(booking)

          await screen.findByText('Ma réservation')

          expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
            message: `Ta réservation "${nameCanceledBooking}" a été annulée`,
            timeout: SNACK_BAR_TIME_OUT,
          })
          expect(navigate).toHaveBeenCalledWith('Bookings')
        })
      })
    })

    describe('booking not found', () => {
      it('should render ScreenError BookingNotFound when booking is not found when data already exists', async () => {
        // We allow this console error because throwing an error when no booking is found 404
        jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)

        renderBookingDetails(undefined, { dataUpdatedAt: new Date().getTime() })

        await screen.findByText('Réservation introuvable !')

        expect(
          screen.getByText(
            `Désolé, nous ne retrouvons pas ta réservation. Peut-être a-t-elle été annulée. N’hésite pas à retrouver la liste de tes réservations terminées et annulées pour t’en assurer.`
          )
        ).toBeOnTheScreen()
      })

      it('should not render ScreenError BookingNotFound when booking is not found and no data exists', async () => {
        renderBookingDetails(undefined, { dataUpdatedAt: 0 })

        await waitFor(() =>
          expect(screen.queryByText('Réservation introuvable\u00a0!')).not.toBeOnTheScreen()
        )
      })
    })

    describe('Itinerary', () => {
      it.each([
        ['isEvent == true', { isEvent: true }],
        ['isPhysical == true', { isPhysical: true, isDigital: false }],
      ])('should render the itinerary button when %s', async (_testLabel, dataProvider) => {
        const getBookingProperties = jest
          .spyOn(bookingPropertiesAPI, 'getBookingProperties')
          .mockReturnValue(dataProvider)

        renderBookingDetails(ongoingBookings)

        await screen.findByText('Ma réservation')

        const itineraryButton = await screen.findByText('Voir l’itinéraire')

        expect(itineraryButton).toBeOnTheScreen()

        getBookingProperties.mockRestore()
      })

      it.each([
        ['canOpenItinerary == false', false, {}],
        [
          'canOpenItinerary == true && isEvent == false && isPhysical == false',
          true,
          { isEvent: false, isPhysical: false },
        ],
        [
          'canOpenItinerary == true && isEvent == false && isPhysical == true && isDigital == true',
          true,
          { isEvent: false, isPhysical: true, isDigital: true },
        ],
      ])(
        'should not render the itinerary button when %s',
        async (_testLabel, canOpenItinerary, dataProvider) => {
          const getBookingProperties = jest
            .spyOn(bookingPropertiesAPI, 'getBookingProperties')
            .mockReturnValue(dataProvider)

          renderBookingDetails(ongoingBookings)

          await screen.findByText('Ma réservation')

          const itineraryButton = screen.queryByText('Voir l’itinéraire')

          expect(itineraryButton).not.toBeOnTheScreen()

          getBookingProperties.mockRestore()
        }
      )
    })

    describe('Analytics', () => {
      it('should trigger logEvent "BookingDetailsScrolledToBottom" when reaching the end', async () => {
        const nativeEventMiddle = {
          layoutMeasurement: { height: 1000 },
          contentOffset: { y: 400 }, // how far did we scroll
          contentSize: { height: 1600 },
        }
        const nativeEventBottom = {
          layoutMeasurement: { height: 1000 },
          contentOffset: { y: 900 },
          contentSize: { height: 1600 },
        }

        renderBookingDetails(ongoingBookings)

        const scrollView = screen.getByTestId('BookingDetailsScrollView')

        await act(async () => {
          await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
        })

        expect(analytics.logBookingDetailsScrolledToBottom).not.toHaveBeenCalled()

        await act(async () => {
          await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
        })

        expect(analytics.logBookingDetailsScrolledToBottom).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('BookingDetails : when FF WIP_NEW_BOOKING_PAGE is on', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_BOOKING_PAGE])
    })

    it('should render BookingDetails', async () => {
      renderBookingDetailsV2(ongoingBookingV2)

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(screen.getByTestId('ticket-punched')).toBeOnTheScreen()
    })

    it('should render the itinerary button when offer is Event', async () => {
      const getBookingProperties = jest
        .spyOn(bookingPropertiesAPI, 'getBookingProperties')
        .mockReturnValue({ isEvent: true })

      renderBookingDetailsV2(ongoingBookingV2)

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      const itineraryButton = await screen.findByText('Voir l’itinéraire')

      expect(itineraryButton).toBeOnTheScreen()

      getBookingProperties.mockRestore()
    })

    it('should display banner warning about disposal', async () => {
      renderBookingDetailsV2(ongoingBookingV2)

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(
        screen.getByText('Tu n’as pas le droit de céder ou de revendre ton billet.')
      ).toBeOnTheScreen()
    })

    it("should render organizer's indications", async () => {
      const withdrawalDetails = 'Une explication de l’organisateur'

      renderBookingDetailsV2({
        ...ongoingBookingV2,
        ticket: {
          ...ongoingBookingV2.ticket,
          withdrawal: {
            ...ongoingBookingV2.ticket?.withdrawal,
            details: withdrawalDetails,
          },
        },
      })

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(screen.getByText(withdrawalDetails)).toBeOnTheScreen()
    })

    it("should render organizer's email", async () => {
      const organizerEmail = 'toto@email.com'

      renderBookingDetailsV2({
        ...ongoingBookingV2,
        stock: {
          ...ongoingBookingV2.stock,
          offer: {
            ...ongoingBookingV2.stock.offer,
            bookingContact: organizerEmail,
          },
        },
      })

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(screen.getByText(organizerEmail)).toBeOnTheScreen()
    })

    it('should log analytics on email press', async () => {
      const organizerEmail = 'toto@email.com'
      renderBookingDetailsV2({
        ...ongoingBookingV2,
        stock: {
          ...ongoingBookingV2.stock,
          offer: {
            ...ongoingBookingV2.stock.offer,
            bookingContact: organizerEmail,
          },
        },
      })

      await user.press(screen.getByText('Contacter l’organisateur'))

      expect(analytics.logClickEmailOrganizer).toHaveBeenCalledTimes(1)

      expect(mockedOpenUrl).toHaveBeenCalledWith(`mailto:${organizerEmail}`, undefined, true)
    })

    it('should redirect to the Offer page and log event', async () => {
      const booking: BookingsResponseV2['ongoingBookings'][number] = ongoingBookingV2
      renderBookingDetailsV2(booking)

      const text = screen.getByText('Voir l’offre')

      await user.press(text)

      const offerId = booking.stock.offer.id

      expect(navigate).toHaveBeenCalledWith('Offer', {
        id: offerId,
        from: 'bookingdetails',
      })
      expect(analytics.logConsultOffer).toHaveBeenCalledWith({ offerId, from: 'bookings' })
    })

    it('should not redirect to the Offer and showSnackBarError when not connected', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })

      renderBookingDetailsV2(ongoingBookingV2)

      const text = screen.getByText('Voir l’offre')

      await user.press(text)

      const offerId = ongoingBookingV2.stock.offer.id

      expect(navigate).not.toHaveBeenCalledWith('Offer', {
        id: offerId,
        from: 'bookingdetails',
      })
      expect(analytics.logConsultOffer).not.toHaveBeenCalledWith({ offerId, from: 'bookings' })
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: `Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should render correctly when offer is not digital withdrawal type is no ticket', async () => {
      renderBookingDetailsV2({
        ...ongoingBookingV2,
        stock: {
          ...ongoingBookingV2.stock,
          offer: {
            ...ongoingBookingV2.stock.offer,
            isDigital: false,
          },
        },
        ticket: {
          ...ongoingBookingV2.ticket,
          display: TicketDisplayEnum.no_ticket,
          withdrawal: {
            type: WithdrawalTypeEnum.no_ticket,
          },
        },
      })
      await screen.findAllByText(ongoingBookings.stock.offer.name)

      expect(
        screen.getByText('Tu n’as pas besoin de billet pour profiter de cette offre !')
      ).toBeOnTheScreen()
    })

    it('should not render error message when booking is no ticket', async () => {
      renderBookingDetailsV2({
        ...ongoingBookingV2,
        quantity: 2,
        ticket: {
          ...ongoingBookingV2.ticket,
          display: TicketDisplayEnum.no_ticket,
          withdrawal: {
            type: WithdrawalTypeEnum.no_ticket,
          },
        },
      })
      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(
        screen.queryByText('Tu n’as pas le droit de céder ou de revendre tes billets.')
      ).not.toBeOnTheScreen()
    })

    it('should render error message with plural when booking is duo', async () => {
      renderBookingDetailsV2({
        ...ongoingBookingV2,
        quantity: 2,
        ticket: {
          ...ongoingBookingV2.ticket,
          display: TicketDisplayEnum.email_sent,
          withdrawal: {
            type: WithdrawalTypeEnum.by_email,
          },
        },
      })
      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(
        screen.getByText('Tu n’as pas le droit de céder ou de revendre tes billets.')
      ).toBeOnTheScreen()
    })

    it('should render error message singular when booking is not duo', async () => {
      renderBookingDetailsV2({
        ...ongoingBookingV2,
        quantity: 1,
        stock: {
          ...ongoingBookingV2.stock,
          offer: {
            ...ongoingBookingV2.stock.offer,
            isDigital: false,
          },
        },
        ticket: {
          ...ongoingBookingV2.ticket,
          display: TicketDisplayEnum.email_sent,
          withdrawal: {
            type: WithdrawalTypeEnum.by_email,
          },
        },
      })
      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(
        screen.getByText('Tu n’as pas le droit de céder ou de revendre ton billet.')
      ).toBeOnTheScreen()
    })

    describe('Ticket', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_BOOKING_PAGE])
      })

      it('should render External Booking Component when externalbooking data is present', async () => {
        renderBookingDetailsV2({
          ...ongoingBookingV2,
          stock: {
            ...ongoingBookingV2.stock,
            offer: {
              ...ongoingBookingV2.stock.offer,
              isDigital: false,
            },
          },
          ticket: {
            ...ongoingBookingV2.ticket,
            withdrawal: {},
            externalBooking: {
              data: [{ barcode: '1234', seat: 'B1' }],
            },
          },
        })
        await screen.findAllByText(ongoingBookingV2.stock.offer.name)

        expect(screen.getByTestId('external-booking-ticket-container')).toBeOnTheScreen()
      })

      it('should render cinema booking ticket if voucher is present', async () => {
        renderBookingDetailsV2({
          ...ongoingBookingV2,
          stock: {
            ...ongoingBookingV2.stock,
            offer: {
              ...ongoingBookingV2.stock.offer,
              isDigital: false,
            },
          },
          ticket: {
            ...ongoingBookingV2.ticket,
            withdrawal: {},
            voucher: { data: 'test-voucher' },
            token: { data: 'test-token' },
          },
        })
        await screen.findAllByText(ongoingBookingV2.stock.offer.name)

        expect(screen.getByTestId('cinema-booking-ticket-container')).toBeOnTheScreen()
      })

      describe('Digital Booking', () => {
        it('should render activation code when offer is digital and activation code is present', async () => {
          renderBookingDetailsV2({
            ...ongoingBookingV2,
            stock: {
              ...ongoingBookingV2.stock,
              offer: {
                ...ongoingBookingV2.stock.offer,
                isDigital: true,
              },
            },
            ticket: {
              ...ongoingBookingV2.ticket,
              token: {
                data: 'TEST12',
              },
              activationCode: {
                code: 'test-activation-code',
                expirationDate: null,
              },
              voucher: null,
              withdrawal: {},
            },
            completedUrl: 'https://example.com',
          })

          await screen.findAllByText(ongoingBookings.stock.offer.name)

          expect(screen.getByText('test-activation-code')).toBeOnTheScreen()
        })

        it('should render token when offer is digital and token is present', async () => {
          renderBookingDetailsV2({
            ...ongoingBookingV2,
            stock: {
              ...ongoingBookingV2.stock,
              offer: {
                ...ongoingBookingV2.stock.offer,
                isDigital: true,
              },
            },
            ticket: {
              ...ongoingBookingV2.ticket,
              token: {
                data: 'TEST12',
              },
              activationCode: null,
              voucher: null,
              withdrawal: {},
            },
          })
          await screen.findAllByText(ongoingBookings.stock.offer.name)

          expect(await screen.findByText('TEST12')).toBeOnTheScreen()
        })
      })

      it('should trigger logEvent "BookingDetailsScrolledToBottom" when reaching the end', async () => {
        const nativeEventMiddle = {
          layoutMeasurement: { height: 1000 },
          contentOffset: { y: 400 }, // how far did we scroll
          contentSize: { height: 1600 },
        }
        const nativeEventBottom = {
          layoutMeasurement: { height: 1000 },
          contentOffset: { y: 900 },
          contentSize: { height: 1600 },
        }

        renderBookingDetailsV2(ongoingBookingV2)

        await screen.findAllByText(ongoingBookingV2.stock.offer.name)

        const scrollView = screen.getByTestId('BookingDetailsScrollView')

        await act(async () => {
          await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
        })

        expect(analytics.logBookingDetailsScrolledToBottom).not.toHaveBeenCalled()

        await act(async () => {
          await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
        })

        expect(analytics.logBookingDetailsScrolledToBottom).toHaveBeenCalledTimes(1)
      })
    })
  })
})

const renderBookingDetails = (booking?: Booking, options = {}) => {
  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBookingQueryV1').mockReturnValue({
    data: booking,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: undefined,
    ...options,
  } as unknown as UseQueryResult<BookingReponse | null, Error>)
  return render(reactQueryProviderHOC(<BookingDetails />))
}

const renderBookingDetailsV2 = (booking?: BookingResponse, options = {}) => {
  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBookingQuery').mockReturnValue({
    data: booking,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: undefined,
    ...options,
  } as unknown as UseQueryResult<BookingResponse | null, Error>)

  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBookingQueryV1').mockReturnValue({
    data: booking,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: undefined,
    ...options,
  } as unknown as UseQueryResult<BookingReponse | null, Error>)
  return render(reactQueryProviderHOC(<BookingDetails />))
}
