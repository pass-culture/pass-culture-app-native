import { BookingResponseV3, ScreeningFeatures } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { getTicketCinemaScreening } from 'features/bookings/helpers/getTicketCinemaScreening'
import { selectBookingDetails } from 'features/bookings/queries/selectors/selectBookingDetails'

const booking = bookingsSnapV2.ongoingBookings[0]

const emptyFeatures: ScreeningFeatures = {
  accessibility: { audio: [], mental: [], motor: [], visual: [] },
  audio: null,
  language: null,
  specialEventType: null,
  video: null,
}

const buildBookingDetails = (screeningFeatures: ScreeningFeatures) =>
  selectBookingDetails({
    ...booking,
    stock: { ...booking.stock, screeningFeatures },
  } as unknown as BookingResponseV3)

describe('getTicketCinemaScreening', () => {
  it('should return undefined when special event screenings are disabled', () => {
    const bookingDetails = buildBookingDetails({ ...emptyFeatures, video: 'IMAX' })

    expect(getTicketCinemaScreening(bookingDetails, false)).toBeUndefined()
  })

  it('should return undefined for a booking without screening details', () => {
    expect(getTicketCinemaScreening(booking, true)).toBeUndefined()
  })

  it('should return undefined when the screening has no displayable feature', () => {
    const bookingDetails = buildBookingDetails(emptyFeatures)

    expect(getTicketCinemaScreening(bookingDetails, true)).toBeUndefined()
  })

  it('should return the features without details when no feature has a description', () => {
    const features = { ...emptyFeatures, video: '4DX' }

    expect(getTicketCinemaScreening(buildBookingDetails(features), true)).toEqual({
      features,
      hasDetails: false,
    })
  })

  it('should return the features with details when a feature has a description', () => {
    const features = { ...emptyFeatures, video: 'IMAX' }

    expect(getTicketCinemaScreening(buildBookingDetails(features), true)).toEqual({
      features,
      hasDetails: true,
    })
  })
})
