import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import type { BookingReponse, BookingsResponse } from 'api/gen'
import { BookingDetailsContent } from 'features/bookings/components/BookingDetailsContent'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { BookingProperties } from 'features/bookings/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesMappingSnap } from 'libs/subcategories/fixtures/mappings'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

const mockProperties = {
  isDuo: false,
  isEvent: true,
  isPhysical: false,
  isDigital: false,
  isPermanent: false,
  hasActivationCode: false,
}

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/firebase/analytics/analytics')

const mockUseSubcategoriesMapping = jest.fn()
jest.mock('libs/subcategories/mappings', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
}))

const booking: BookingsResponse['ongoing_bookings'][number] = bookingsSnap.ongoing_bookings[0]

describe('<BookingDetailsContent />', () => {
  beforeEach(() => setFeatureFlags())

  it('should navigate to Venue page when venue isOpenToPublic', async () => {
    renderBookingDetailsContent({ booking, properties: mockProperties })

    const venueBlock = screen.getByText('Maison de la Brique')
    await user.press(venueBlock)

    expect(navigate).toHaveBeenCalledWith('Venue', { id: 2185 })
  })

  it('should locConsultVenue when click on venue which is OpenToPublic', async () => {
    renderBookingDetailsContent({ booking, properties: mockProperties })

    const venueBlock = screen.getByText('Maison de la Brique')
    await user.press(venueBlock)

    expect(analytics.logConsultVenue).toHaveBeenCalledWith({ venueId: 2185, from: 'bookings' })
  })

  it('should not navigate to Venue page when venue is not OpenToPublic', async () => {
    const bookingWithVenueNotOpenedToPublic = booking
    bookingWithVenueNotOpenedToPublic.stock.offer.venue.isOpenToPublic = false

    renderBookingDetailsContent({
      booking: bookingWithVenueNotOpenedToPublic,
      properties: mockProperties,
    })

    const venueBlock = screen.getByText('Maison de la Brique')
    await user.press(venueBlock)

    expect(navigate).not.toHaveBeenCalledWith('Venue', { id: 2185 })
  })

  it('should display seeItineraryButton when offer is event and offer address is defined', async () => {
    renderBookingDetailsContent({ booking, properties: { ...mockProperties, isEvent: true } })

    expect(screen.getByText('Voir l’itinéraire')).toBeOnTheScreen()
  })

  it('should display seeItineraryButton when offer is physical and not digital and offer address is defined', async () => {
    renderBookingDetailsContent({
      booking,
      properties: { ...mockProperties, isEvent: false, isDigital: false, isPhysical: true },
    })

    expect(screen.getByText('Voir l’itinéraire')).toBeOnTheScreen()
  })

  it('should not display seeItineraryButton when offer is physical and digital and offer address is defined', async () => {
    renderBookingDetailsContent({
      booking,
      properties: { ...mockProperties, isEvent: false, isDigital: true, isPhysical: true },
    })

    expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
  })

  it('should not display seeItineraryButton when offer is neither physical neither digital and offer address is defined', async () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    renderBookingDetailsContent({
      booking,
      properties: { ...mockProperties, isEvent: false, isDigital: false, isPhysical: false },
    })

    expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
  })

  it('should logConsultItinerary when click on itinerary', async () => {
    renderBookingDetailsContent({ booking, properties: mockProperties })

    const seeItineraryButton = screen.getByText('Voir l’itinéraire')
    await user.press(seeItineraryButton)

    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({
      offerId: 147874,
      from: 'bookingdetails',
    })
  })

  it('should logCancelBooking when booking is canceled', async () => {
    renderBookingDetailsContent({ booking, properties: mockProperties })

    const cancelBookingButton = screen.getByText('Annuler ma réservation')
    await user.press(cancelBookingButton)

    expect(analytics.logCancelBooking).toHaveBeenCalledWith(147874)
  })

  it('should display CancelModal when booking is canceled', async () => {
    renderBookingDetailsContent({ booking, properties: mockProperties })

    const cancelBookingButton = screen.getByText('Annuler ma réservation')
    await user.press(cancelBookingButton)

    expect(screen.getByText('Retourner à ma réservation')).toBeOnTheScreen()
  })

  it('should log cancelBooking when cancel button is clicked', async () => {
    renderBookingDetailsContent({ properties: mockProperties, booking })

    const cancelButton = screen.getByText('Annuler ma réservation')
    await user.press(cancelButton)

    expect(analytics.logCancelBooking).toHaveBeenNthCalledWith(1, booking.stock.offer.id)
  })

  it('should trigger logEvent "ConsultAllOffer" when reaching the end', async () => {
    renderBookingDetailsContent({ properties: mockProperties, booking })

    const scrollView = await screen.findByTestId('BookingDetailsScrollView')

    // Scroll a bit
    user.scrollTo(scrollView, {
      layoutMeasurement: { height: 1000, width: 400 },
      contentSize: { height: 1900, width: 400 },
      y: 400,
    })

    expect(analytics.logViewedBookingPage).not.toHaveBeenCalled()

    // Scroll to the bottom
    user.scrollTo(scrollView, {
      layoutMeasurement: { height: 1000, width: 400 },
      contentSize: { height: 1900, width: 400 },
      y: 1900,
    })

    await screen.findByTestId('Annuler ma réservation')

    expect(analytics.logBookingDetailsScrolledToBottom).toHaveBeenCalledTimes(1)
  })
})

const renderBookingDetailsContent = ({
  properties,
  booking,
}: {
  properties: BookingProperties
  booking: BookingReponse
}) => {
  return render(
    reactQueryProviderHOC(
      <BookingDetailsContent
        properties={properties}
        booking={booking}
        mapping={subcategoriesMappingSnap as SubcategoriesMapping}
      />
    )
  )
}
