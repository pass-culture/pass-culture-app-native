import { OfferResponse } from 'api/gen'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { getMovieOffersByDay } from 'features/offer/helpers/useGetVenueByDay/getMovieOffersByDay'
import { useUserLocation } from 'features/offer/helpers/useUserLocation/useUserLocation'

export const useGetVenuesByDay = (date: Date, offers: OfferResponse[]) => {
  const location = useUserLocation()

  return getMovieOffersByDay(date, offers, location, moviesOfferBuilder)
}
