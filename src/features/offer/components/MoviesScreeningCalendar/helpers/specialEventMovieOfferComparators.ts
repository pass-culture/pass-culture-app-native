import { getEarliestScreeningTimestamp } from 'features/offer/components/MoviesScreeningCalendar/helpers/specialEventMovieOfferDates'
import { SpecialEventMovieOffer } from 'features/offer/components/MoviesScreeningCalendar/specialEventTypes'
import { GeoCoordinates } from 'libs/location/location'
import { computeDistanceInMeters } from 'libs/parsers/formatDistance'

export const compareSpecialEventMovieOffersByBookings = (
  firstOffer: SpecialEventMovieOffer,
  secondOffer: SpecialEventMovieOffer
) => {
  const firstBookings = firstOffer.offer.last30DaysBookings
  const secondBookings = secondOffer.offer.last30DaysBookings

  if (firstBookings == null) return 1
  if (secondBookings == null) return -1

  return secondBookings === firstBookings
    ? getEarliestScreeningTimestamp(firstOffer.offer.stocks) -
        getEarliestScreeningTimestamp(secondOffer.offer.stocks)
    : secondBookings - firstBookings
}

export const compareSpecialEventMovieOffersByDistance = (location: GeoCoordinates) =>
  function compareByDistance(
    firstOffer: SpecialEventMovieOffer,
    secondOffer: SpecialEventMovieOffer
  ) {
    const firstDistance = getDistanceFromOffer(firstOffer, location)
    const secondDistance = getDistanceFromOffer(secondOffer, location)

    return firstDistance === secondDistance
      ? getEarliestScreeningTimestamp(firstOffer.offer.stocks) -
          getEarliestScreeningTimestamp(secondOffer.offer.stocks)
      : firstDistance - secondDistance
  }

export const compareSpecialEventMovieOffersByDate = (
  firstOffer: SpecialEventMovieOffer,
  secondOffer: SpecialEventMovieOffer
) => new Date(firstOffer.nextDate ?? 0).getTime() - new Date(secondOffer.nextDate ?? 0).getTime()

const getDistanceFromOffer = (offer: SpecialEventMovieOffer, location: GeoCoordinates) =>
  computeDistanceInMeters(
    offer.offer.venue.coordinates.latitude ?? 0,
    offer.offer.venue.coordinates.longitude ?? 0,
    location.latitude,
    location.longitude
  )
