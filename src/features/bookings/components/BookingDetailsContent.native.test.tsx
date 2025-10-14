import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingResponse, TicketDisplayEnum } from 'api/gen'
import { BookingDetailsContent } from 'features/bookings/components/BookingDetailsContent'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { BookingProperties } from 'features/bookings/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesMappingSnap } from 'libs/subcategories/fixtures/mappings'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderAsync, screen, userEvent } from 'tests/utils'

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

const booking: BookingResponse = bookingsSnapV2.ongoingBookings[0]
const bookingVenueOpenToPublic: BookingResponse = {
  ...booking,
  stock: {
    ...booking.stock,
    offer: {
      ...booking.stock.offer,
      address: {
        id: 116,
        street: '1 boulevard de la brique',
        postalCode: '93700',
        city: 'Drancy',
        coordinates: {
          latitude: 48.91683,
          longitude: 2.43884,
        },
        timezone: 'Europe/Paris',
      },
    },
  },
}
const bookingVenueNotOpenToPublic: BookingResponse = {
  ...booking,
  stock: {
    ...booking.stock,
    offer: {
      ...booking.stock.offer,
      venue: { ...booking.stock.offer.venue, isOpenToPublic: false, id: 115 },
    },
  },
}

describe('<BookingDetailsContent />', () => {
  beforeEach(() => setFeatureFlags())

  it('should navigate to Venue page when venue isOpenToPublic and booking adress is the same', async () => {
    await renderBookingDetailsContent({
      booking: bookingVenueOpenToPublic,
      properties: mockProperties,
    })

    const venueBlock = screen.getByText('Maison de la Brique')
    await user.press(venueBlock)

    expect(navigate).toHaveBeenCalledWith('Venue', { id: 2185 })
  })

  it('should locConsultVenue when click on venue which is OpenToPublic and booking adress is the same', async () => {
    await renderBookingDetailsContent({
      booking: bookingVenueOpenToPublic,
      properties: mockProperties,
    })

    const venueBlock = screen.getByText('Maison de la Brique')
    await user.press(venueBlock)

    expect(analytics.logConsultVenue).toHaveBeenCalledWith({ venueId: '2185', from: 'bookings' })
  })

  it('should not navigate to Venue page when venue is not OpenToPublic', async () => {
    await renderBookingDetailsContent({
      booking: bookingVenueNotOpenToPublic,
      properties: mockProperties,
    })

    const venueBlock = screen.getByText('1 boulevard de la brique, 93700 Drancy')
    await user.press(venueBlock)

    expect(navigate).not.toHaveBeenCalledWith('Venue', { id: 2185 })
  })

  it('should not navigate to Venue page when venue is OpenToPublic but booking adress is not the same', async () => {
    await renderBookingDetailsContent({
      booking,
      properties: mockProperties,
    })

    const venueBlock = screen.getByText('1 boulevard de la brique, 93700 Drancy')
    await user.press(venueBlock)

    expect(navigate).not.toHaveBeenCalledWith('Venue', { id: 2185 })
  })

  it('should display seeItineraryButton when offer is event and offer address is defined', async () => {
    await renderBookingDetailsContent({ booking, properties: { ...mockProperties, isEvent: true } })

    expect(screen.getByText('Voir l’itinéraire')).toBeOnTheScreen()
  })

  it('should display seeItineraryButton when offer is physical and not digital and offer address is defined', async () => {
    await renderBookingDetailsContent({
      booking,
      properties: { ...mockProperties, isEvent: false, isDigital: false, isPhysical: true },
    })

    expect(screen.getByText('Voir l’itinéraire')).toBeOnTheScreen()
  })

  it('should not display seeItineraryButton when offer is physical and digital and offer address is defined', async () => {
    await renderBookingDetailsContent({
      booking,
      properties: { ...mockProperties, isEvent: false, isDigital: true, isPhysical: true },
    })

    expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
  })

  it('should not display seeItineraryButton when offer is neither physical neither digital and offer address is defined', async () => {
    const booking: BookingResponse = {
      ...bookingsSnapV2.ongoingBookings[0],
    }
    await renderBookingDetailsContent({
      booking,
      properties: { ...mockProperties, isEvent: false, isDigital: false, isPhysical: false },
    })

    expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
  })

  it('should logConsultItinerary when click on itinerary', async () => {
    await renderBookingDetailsContent({ booking, properties: mockProperties })

    const seeItineraryButton = screen.getByText('Voir l’itinéraire')
    await user.press(seeItineraryButton)

    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({
      offerId: 147874,
      from: 'bookingdetails',
    })
  })

  it('should logCancelBooking when booking is canceled', async () => {
    await renderBookingDetailsContent({ booking, properties: mockProperties })

    const cancelBookingButton = screen.getByText('Annuler ma réservation')
    await user.press(cancelBookingButton)

    expect(analytics.logCancelBooking).toHaveBeenCalledWith(147874)
  })

  it('should display CancelModal when booking is canceled', async () => {
    await renderBookingDetailsContent({ booking, properties: mockProperties })

    const cancelBookingButton = screen.getByText('Annuler ma réservation')
    await user.press(cancelBookingButton)

    expect(screen.getByText('Retourner à ma réservation')).toBeOnTheScreen()
  })

  it('should log cancelBooking when cancel button is clicked', async () => {
    await renderBookingDetailsContent({ properties: mockProperties, booking })

    const cancelButton = screen.getByText('Annuler ma réservation')
    await user.press(cancelButton)

    expect(analytics.logCancelBooking).toHaveBeenNthCalledWith(1, booking.stock.offer.id)
  })

  it('should trigger logEvent "ConsultAllOffer" when reaching the end', async () => {
    await renderBookingDetailsContent({ properties: mockProperties, booking })

    const scrollView = await screen.findByTestId('BookingDetailsScrollView')

    // Scroll a bit
    await user.scrollTo(scrollView, {
      layoutMeasurement: { height: 1000, width: 400 },
      contentSize: { height: 1900, width: 400 },
      y: 400,
    })

    expect(analytics.logViewedBookingPage).not.toHaveBeenCalled()

    // Scroll to the bottom
    await user.scrollTo(scrollView, {
      layoutMeasurement: { height: 1000, width: 400 },
      contentSize: { height: 1900, width: 400 },
      y: 1900,
    })

    await screen.findByTestId('Annuler ma réservation')

    expect(analytics.logBookingDetailsScrolledToBottom).toHaveBeenCalledTimes(1)
  })

  it('should display a punched ticket when offer is an event', async () => {
    await renderBookingDetailsContent({ properties: { ...mockProperties, isEvent: true }, booking })

    expect(screen.getByTestId('ticket-punched')).toBeOnTheScreen()
  })

  it('should display a full ticket when offer is not an event', async () => {
    await renderBookingDetailsContent({
      properties: { ...mockProperties, isEvent: false },
      booking,
    })

    expect(screen.getByTestId('ticket-full')).toBeOnTheScreen()
  })

  it('should not display error banner when booking is no ticket', async () => {
    await renderBookingDetailsContent({
      properties: { ...mockProperties, isEvent: false },
      booking: {
        ...bookingsSnapV2.ongoingBookings[0],
        ticket: {
          ...bookingsSnapV2.ongoingBookings[0].ticket,
          display: TicketDisplayEnum.no_ticket,
        },
      },
    })

    expect(
      screen.queryByText('Tu n’as pas le droit de céder ou de revendre ton billet.')
    ).not.toBeOnTheScreen()
  })

  it('should display error banner when booking has a ticket', async () => {
    await renderBookingDetailsContent({
      properties: { ...mockProperties, isEvent: false },
      booking: {
        ...bookingsSnapV2.ongoingBookings[0],
        ticket: {
          ...bookingsSnapV2.ongoingBookings[0].ticket,
          display: TicketDisplayEnum.ticket,
        },
      },
    })

    expect(
      screen.getByText('Tu n’as pas le droit de céder ou de revendre ton billet.')
    ).toBeOnTheScreen()
  })

  it('should display message to contact organizer when booking has a ticket', async () => {
    await renderBookingDetailsContent({
      properties: { ...mockProperties, isEvent: false },
      booking: {
        ...bookingsSnapV2.ongoingBookings[0],
        stock: {
          ...bookingsSnapV2.ongoingBookings[0].stock,
          offer: {
            ...bookingsSnapV2.ongoingBookings[0].stock.offer,
            bookingContact: 'emailDeLorganisateur@emailSchema.com',
          },
        },
        ticket: {
          ...bookingsSnapV2.ongoingBookings[0].ticket,
          display: TicketDisplayEnum.ticket,
        },
      },
    })

    expect(
      screen.getByText(
        `Si tu n’as pas reçu tes billets, contacte l’organisateur\u00a0:\n emailDeLorganisateur@emailSchema.com`
      )
    ).toBeOnTheScreen()
  })

  it('should not display message to contact organizer when booking has no ticket', async () => {
    await renderBookingDetailsContent({
      properties: { ...mockProperties, isEvent: false },
      booking: {
        ...bookingsSnapV2.ongoingBookings[0],
        stock: {
          ...bookingsSnapV2.ongoingBookings[0].stock,
          offer: {
            ...bookingsSnapV2.ongoingBookings[0].stock.offer,
            bookingContact: 'emailDeLorganisateur@emailSchema.com',
          },
        },
        ticket: {
          ...bookingsSnapV2.ongoingBookings[0].ticket,
          display: TicketDisplayEnum.no_ticket,
        },
      },
    })

    expect(
      screen.queryByText(
        `Si tu n’as pas reçu tes billets, contacte l’organisateur\u00a0:\n emailDeLorganisateur@emailSchema.com`
      )
    ).not.toBeOnTheScreen()
  })

  it('should display organizer email when booking has no ticket', async () => {
    await renderBookingDetailsContent({
      properties: { ...mockProperties, isEvent: false },
      booking: {
        ...bookingsSnapV2.ongoingBookings[0],
        stock: {
          ...bookingsSnapV2.ongoingBookings[0].stock,
          offer: {
            ...bookingsSnapV2.ongoingBookings[0].stock.offer,
            bookingContact: 'emailDeLorganisateur@emailSchema.com',
          },
        },
        ticket: {
          ...bookingsSnapV2.ongoingBookings[0].ticket,
          display: TicketDisplayEnum.no_ticket,
        },
      },
    })

    expect(screen.getByText(`emailDeLorganisateur@emailSchema.com`)).toBeOnTheScreen()
  })
})

const renderBookingDetailsContent = ({
  properties,
  booking,
}: {
  properties: BookingProperties
  booking: BookingResponse
}) => {
  return renderAsync(
    reactQueryProviderHOC(
      <BookingDetailsContent
        user={beneficiaryUser}
        properties={properties}
        booking={booking}
        mapping={subcategoriesMappingSnap as SubcategoriesMapping}
      />
    )
  )
}
