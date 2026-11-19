import { OfferForStocksResponse } from 'api/gen'
import { specialEventMoviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/specialEventMoviesOffer.builder'
import { getMovieOffersByDay } from 'features/offer/helpers/useGetVenueByDay/getMovieOffersByDay'
import { useUserLocation } from 'features/offer/helpers/useUserLocation/useUserLocation'

export const useGetSpecialEventVenuesByDay = (date: Date, offers: OfferForStocksResponse[]) => {
  const location = useUserLocation()

  return getMovieOffersByDay(date, offers, location, specialEventMoviesOfferBuilder)
}
