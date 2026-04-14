import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  BookingResponse,
  BookingsResponseV2,
  SubcategoriesResponseModelv2,
  TicketDisplayEnum,
  WithdrawalTypeEnum,
} from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import * as bookingPropertiesAPI from 'features/bookings/helpers/getBookingProperties'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import * as useBookingByIdQueryAPI from 'queries/bookings/useBookingByIdQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

import { BookingDetails as BookingDetailsDefault } from './BookingDetails'

const BookingDetails = withAsyncErrorBoundary(BookingDetailsDefault)

jest.mock('features/auth/context/AuthContext')
jest.mock('features/profile/helpers/isUserExBeneficiary')

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.useFakeTimers()

jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

const mockBookingsV2: BookingsResponseV2 = { ...bookingsSnapV2 }

jest.mock('queries/bookings/useBookingsQuery', () => ({
  useBookingsV2Query: jest.fn(() => ({
    data: mockBookingsV2,
  })),
}))

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()

describe('BookingDetails', () => {
  let ongoingBookingV2: BookingResponse = bookingsSnapV2.ongoingBookings[0]

  beforeEach(() => {
    ongoingBookingV2 = bookingsSnapV2.ongoingBookings[0]

    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  })

  describe('BookingDetails : when FF WIP_NEW_BOOKINGS_ENDED_ONGOING is on', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_BOOKINGS_ENDED_ONGOING])
    })

    it('should render BookingDetails', async () => {
      renderBookingDetailsWithBookingById(ongoingBookingV2)

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(screen.getByTestId('ticket-punched')).toBeOnTheScreen()
    })

    it('should render the itinerary button when offer is Event', async () => {
      const getBookingProperties = jest
        .spyOn(bookingPropertiesAPI, 'getBookingProperties')
        .mockReturnValue({ isEvent: true })

      renderBookingDetailsWithBookingById(ongoingBookingV2)

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      const itineraryButton = await screen.findByText('Voir l’itinéraire')

      expect(itineraryButton).toBeOnTheScreen()

      getBookingProperties.mockRestore()
    })

    it('should display banner warning about disposal', async () => {
      renderBookingDetailsWithBookingById(ongoingBookingV2)

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(
        screen.getByText('Tu n’as pas le droit de céder ou de revendre ton billet.')
      ).toBeOnTheScreen()
    })

    it("should render organizer's indications", async () => {
      const withdrawalDetails = 'Une explication de l’organisateur'

      renderBookingDetailsWithBookingById({
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

    it('should render message to contact organizer', async () => {
      const organizerEmail = 'toto@email.com'

      renderBookingDetailsWithBookingById({
        ...ongoingBookingV2,
        stock: {
          ...ongoingBookingV2.stock,
          offer: {
            ...ongoingBookingV2.stock.offer,
            bookingContact: organizerEmail,
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
        screen.getByText(
          `Si tu n’as pas reçu tes billets, contacte l’organisateur\u00a0:\n${organizerEmail}`
        )
      ).toBeOnTheScreen()
    })

    it("should render organizer's email", async () => {
      const organizerEmail = 'toto@email.com'

      renderBookingDetailsWithBookingById({
        ...ongoingBookingV2,
        stock: {
          ...ongoingBookingV2.stock,
          offer: {
            ...ongoingBookingV2.stock.offer,
            bookingContact: organizerEmail,
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

      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(screen.getByText(organizerEmail)).toBeOnTheScreen()
    })

    it('should log analytics on `Contacter l’organisateur` press', async () => {
      const organizerEmail = 'toto@email.com'
      renderBookingDetailsWithBookingById({
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
      const booking = ongoingBookingV2
      renderBookingDetailsWithBookingById(booking)

      const text = screen.getByText('Voir l’offre')

      await user.press(text)

      const offerId = booking.stock.offer.id

      expect(navigate).toHaveBeenCalledWith('Offer', {
        id: offerId,
        from: 'bookingdetails',
      })
      expect(analytics.logConsultOffer).toHaveBeenCalledWith({
        offerId: String(offerId),
        from: 'bookings',
        isHeadline: false,
      })
    })

    it('should not redirect to the Offer and showSnackBarError when not connected', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })

      renderBookingDetailsWithBookingById(ongoingBookingV2)

      const text = screen.getByText('Voir l’offre')

      await user.press(text)

      const offerId = ongoingBookingV2.stock.offer.id

      expect(navigate).not.toHaveBeenCalledWith('Offer', {
        id: offerId,
        from: 'bookingdetails',
      })
      expect(analytics.logConsultOffer).not.toHaveBeenCalledWith({ offerId, from: 'bookings' })
      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(
        screen.getByText(
          `Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.`
        )
      ).toBeOnTheScreen()
    })

    it('should render correctly when offer is not digital withdrawal type is no ticket', async () => {
      renderBookingDetailsWithBookingById({
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
      await screen.findAllByText(ongoingBookingV2.stock.offer.name)

      expect(
        screen.getByText('Tu n’as pas besoin de billet pour profiter de cette offre !')
      ).toBeOnTheScreen()
    })

    it('should not render error message when booking is no ticket', async () => {
      renderBookingDetailsWithBookingById({
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
      renderBookingDetailsWithBookingById({
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
      renderBookingDetailsWithBookingById({
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
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_BOOKINGS_ENDED_ONGOING])
      })

      it('should render External Booking Component when externalbooking data is present', async () => {
        renderBookingDetailsWithBookingById({
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
        renderBookingDetailsWithBookingById({
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
          renderBookingDetailsWithBookingById({
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

          await screen.findAllByText(ongoingBookingV2.stock.offer.name)

          expect(screen.getByText('test-activation-code')).toBeOnTheScreen()
        })

        it('should render token when offer is digital and token is present', async () => {
          renderBookingDetailsWithBookingById({
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
          await screen.findAllByText(ongoingBookingV2.stock.offer.name)

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

        renderBookingDetailsWithBookingById(ongoingBookingV2)

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

const renderBookingDetailsWithBookingById = (booking?: BookingResponse, options = {}) => {
  jest.spyOn(useBookingByIdQueryAPI, 'useBookingByIdQuery').mockReturnValue({
    data: booking,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: undefined,
    ...options,
  } as unknown as UseQueryResult<BookingResponse | null, Error>)

  return render(reactQueryProviderHOC(<BookingDetails />))
}
