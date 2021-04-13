import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { CategoryNameEnum, CategoryType } from 'api/gen'
import * as Queries from 'features/bookings/api/queries'
import * as Helpers from 'features/bookings/helpers'
import * as NavigationHelpers from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import * as OpenItinerary from 'libs/itinerary/useOpenItinerary'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render } from 'tests/utils'

import { bookingsSnap } from '../api/bookingsSnap'
import { Booking } from '../components/types'

import { BookingDetails } from './BookingDetails'

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: undefined })),
}))
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

describe('BookingDetails', () => {
  afterEach(jest.restoreAllMocks)

  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        id: 456,
        shouldFetchAll: true,
      },
    }))
  })

  it('should call useOngoingBooking with the right parameters', () => {
    const useOngoingBooking = jest.spyOn(Queries, 'useOngoingBooking')

    const booking = bookingsSnap.ongoing_bookings[0]
    renderBookingDetails(booking)
    expect(useOngoingBooking).toBeCalledWith(456, true)
  })

  it('should render correctly', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByTestId, toJSON } = renderBookingDetails(booking)

    await act(async () => {
      getByTestId('three-shapes-ticket').props.onLayout({ nativeEvent: { layout: { width: 150 } } })
    })
    expect(toJSON()).toMatchSnapshot()
  })

  describe('<DetailedBookingTicket />', () => {
    it('should display booking token', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      const { getByText, getByTestId } = renderBookingDetails(booking)
      await act(async () => {
        getByTestId('three-shapes-ticket').props.onLayout({
          nativeEvent: { layout: { width: 150 } },
        })
      })

      getByText('352UW4')
    })

    it('should display offer link button if offer is digital and open url on press', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      const openExternalUrl = jest
        .spyOn(NavigationHelpers, 'openExternalUrl')
        .mockImplementation(jest.fn())
      booking.stock.offer.isDigital = true
      booking.stock.offer.url = 'http://example.com'

      const { getByText, getByTestId } = renderBookingDetails(booking)
      await act(async () => {
        getByTestId('three-shapes-ticket').props.onLayout({
          nativeEvent: { layout: { width: 150 } },
        })
      })
      const offerButton = getByText("Accéder à l'offre")
      fireEvent.press(offerButton)

      expect(openExternalUrl).toHaveBeenCalledWith(booking.stock.offer.url)
      expect(analytics.logAccessExternalOffer).toHaveBeenCalledWith(booking.stock.offer.id)
    })

    it('should display booking qr code if offer is physical', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = false
      const { getByTestId } = renderBookingDetails(booking)
      await act(async () => {
        getByTestId('three-shapes-ticket').props.onLayout({
          nativeEvent: { layout: { width: 150 } },
        })
      })
      getByTestId('qr-code')
    })

    it('should display EAN code if offer is a book (digital or physical)', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.category.name = CategoryNameEnum.LIVRE
      const { getByText, getByTestId } = renderBookingDetails(booking)
      await act(async () => {
        getByTestId('three-shapes-ticket').props.onLayout({
          nativeEvent: { layout: { width: 150 } },
        })
      })
      getByText('123456789')
    })
  })

  describe('Offer rules', () => {
    it('should display rules for a digital offer', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = true

      const { getByText } = renderBookingDetails(booking)

      getByText(
        'Ce code à 6 caractères est ta preuve d’achat ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
      )
    })
    it.each([
      [
        'event',
        (booking: Booking) => (booking.stock.offer.category.categoryType = CategoryType.Event),
      ],
      [
        'physical',
        (booking: Booking) => (booking.stock.offer.category.categoryType = CategoryType.Thing),
      ],
    ])('should display rules for a %s & non-digital offer', (type, prepareBooking) => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      booking.stock.offer.isDigital = false
      prepareBooking(booking)

      const { getByText } = renderBookingDetails(booking)

      getByText(
        'Tu dois présenter ta carte d’identité et ce code de 6 caractères pour profiter de ta réservation ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
      )
    })
  })

  describe('withdrawalDetails', () => {
    it('should display withdrawal details', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.withdrawalDetails = 'Voici comment récupérer ton bien'
      const { getByText } = renderBookingDetails(booking)

      getByText('Modalités de retrait')
      getByText(booking.stock.offer.withdrawalDetails)
    })
    it('should not display withdrawal details', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.withdrawalDetails = undefined
      const { queryByTestId, queryByText } = renderBookingDetails(booking)

      const title = queryByText('Modalités de retrait')
      const withdrawalText = queryByTestId('withdrawalDetails')

      expect(title).toBeFalsy()
      expect(withdrawalText).toBeFalsy()
    })
  })
  it('should redirect to the Offer page and log event', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = renderBookingDetails(booking)

    const text = getByText('Voir le détail de l’offre')
    fireEvent.press(text)

    const offerId = booking.stock.offer.id

    expect(navigate).toBeCalledWith('Offer', {
      id: offerId,
      shouldDisplayLoginModal: false,
      from: 'bookingdetails',
    })
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({ offerId, from: 'bookings' })
  })

  describe('cancellation button', () => {
    it('should display button if offer is permanent', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isPermanent = true
      const { getByTestId } = renderBookingDetails(booking)
      getByTestId('button-title-cancel')
    })

    it('should display button if confirmation date is not expired', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      const date = new Date()
      date.setDate(date.getDate() + 1)
      booking.confirmationDate = date
      const { getByTestId } = renderBookingDetails(booking)
      getByTestId('button-title-cancel')
    })

    it('should not display button if confirmation date is expired', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isPermanent = false
      booking.confirmationDate = new Date('2020-03-15T23:01:37.925926')
      const { queryByTestId } = renderBookingDetails(booking)
      expect(queryByTestId('button-title-cancel')).toBeFalsy()
    })

    it('should log event "CancelBooking" when cancelling booking', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      const date = new Date()
      date.setDate(date.getDate() + 1)
      booking.confirmationDate = date
      const { getByTestId } = renderBookingDetails(booking)
      fireEvent.press(getByTestId('button-title-cancel'))

      expect(analytics.logCancelBooking).toHaveBeenCalledWith(booking.stock.offer.id)
    })
  })

  describe('Itinerary', () => {
    it.each([
      ['isEvent == true', { isEvent: true }],
      ['isPhysical == true', { isPhysical: true }],
    ])('should render the itinerary button when %s', (_testLabel, dataProvider) => {
      const openItinerary = jest.spyOn(OpenItinerary, 'default').mockReturnValue({
        openItinerary: jest.fn(),
        canOpenItinerary: true,
      })
      const getBookingProperties = jest
        .spyOn(Helpers, 'getBookingProperties')
        .mockReturnValue(dataProvider)

      const booking = bookingsSnap.ongoing_bookings[0]
      const { getByText } = renderBookingDetails(booking)
      getByText("Voir l'itinéraire")

      openItinerary.mockRestore()
      getBookingProperties.mockRestore()
    })
    it.each([
      ['canOpenItinerary == false', false, {}],
      [
        'canOpenItinerary == true && isEvent == false && isPhysical == false',
        true,
        { isEvent: false, isPhysical: false },
      ],
    ])(
      'should not render the itinerary button when %s',
      (_testLabel, canOpenItinerary, dataProvider) => {
        const openItinerary = jest.spyOn(OpenItinerary, 'default').mockReturnValue({
          openItinerary: jest.fn(),
          canOpenItinerary,
        })
        const getBookingProperties = jest
          .spyOn(Helpers, 'getBookingProperties')
          .mockReturnValue(dataProvider)

        const booking = bookingsSnap.ongoing_bookings[0]
        const { queryByText } = renderBookingDetails(booking)
        const button = queryByText("Voir l'itinéraire")
        expect(button).toBeFalsy()

        openItinerary.mockRestore()
        getBookingProperties.mockRestore()
      }
    )
  })
})

function renderBookingDetails(booking: Booking) {
  jest.spyOn(Queries, 'useOngoingBooking').mockReturnValue(booking)
  return render(reactQueryProviderHOC(<BookingDetails />))
}
