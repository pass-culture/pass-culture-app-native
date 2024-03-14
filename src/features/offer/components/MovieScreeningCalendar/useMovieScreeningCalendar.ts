import { useEffect, useState, useMemo } from 'react'

import { OfferStockResponse, BookingReponse } from 'api/gen'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enum'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/type'
import { sortScreeningDates } from 'features/offer/components/MovieScreeningCalendar/utils'
import { formatToFrenchDecimal } from 'libs/parsers'
import { EventCardProps } from 'ui/components/eventCard/EventCard'

export const useMovieScreeningCalendar = (stocks: OfferStockResponse[]) => {
  const [bookingData, setBookingData] = useState<MovieScreeningBookingData>()
  const [selectedDate, setSelectedDate] = useState<Date>()

  const getDateString = (date: string) => new Date(date).toDateString()

  const movieScreenings = useMemo(
    () =>
      stocks.reduce<{
        [key: string]: OfferStockResponse[]
      }>((movieScreening, movieStock) => {
        const { beginningDatetime, isExpired, isForbiddenToUnderage } = movieStock
        if (beginningDatetime != null && !isExpired && !isForbiddenToUnderage) {
          const movieScreeningDay = getDateString(beginningDatetime)
          if (movieScreening[movieScreeningDay]) {
            // @ts-expect-error: because of noUncheckedIndexedAccess
            movieScreening[movieScreeningDay].push(movieStock)
          } else {
            movieScreening[movieScreeningDay] = [movieStock]
          }
        }

        return movieScreening
      }, {}),
    [stocks]
  )

  const movieScreeningDates: Date[] = useMemo(
    () =>
      Object.keys(movieScreenings)
        .map((dateString) => new Date(dateString))
        .sort((a, b) => {
          return a.getTime() - b.getTime()
        }),
    [movieScreenings]
  )
  useEffect(() => {
    setSelectedDate(movieScreeningDates[0])
  }, [movieScreeningDates])

  const getSelectedDateScreenings = (
    offerVenueId: number,
    hasBookedOffer: boolean,
    userCredit: number,
    isLoggedIn?: boolean,
    onPressOfferCTA?: () => void,
    userBooking?: BookingReponse | null
  ) => {
    let screeningDates = movieScreenings[getDateString(`${selectedDate}`)]
    if (!screeningDates) {
      return
    }
    screeningDates = sortScreeningDates(screeningDates)
    let eventCardProps: EventCardProps
    return screeningDates?.map((screening) => {
      const { beginningDatetime, isSoldOut } = screening
      if (beginningDatetime != null) {
        const hasEnoughCredit = isLoggedIn ? screening.price <= userCredit : true
        const price = formatToFrenchDecimal(screening.price).replace(' ', '')
        const hasBookedScreening = userBooking?.stock?.beginningDatetime === beginningDatetime
        const isSameVenue = offerVenueId === userBooking?.stock?.offer?.venue?.id

        let isDisabled: boolean
        let subtitleLeft
        switch (true) {
          case hasBookedScreening:
            subtitleLeft = EventCardSubtitleEnum.ALREADY_BOOKED
            isDisabled = true
            break
          case isSoldOut:
            subtitleLeft = EventCardSubtitleEnum.FULLY_BOOKED
            isDisabled = true
            break
          case isSameVenue && hasBookedOffer:
            subtitleLeft = screening.features.join(', ')
            isDisabled = true
            break
          case !hasEnoughCredit:
            subtitleLeft = EventCardSubtitleEnum.NOT_ENOUGH_CREDIT
            isDisabled = true
            break
          default:
            subtitleLeft = screening.features.join(', ')
            isDisabled = false
        }

        const shouldNotHaveSubtitleRight =
          subtitleLeft === EventCardSubtitleEnum.NOT_ENOUGH_CREDIT ||
          subtitleLeft === EventCardSubtitleEnum.ALREADY_BOOKED
        const subtitleRight = shouldNotHaveSubtitleRight ? '' : price

        const onPress = () => {
          if (hasBookedScreening || isDisabled) {
            return
          }
          setBookingData({
            date: new Date(beginningDatetime),
            hour: new Date(beginningDatetime).getHours(),
            stockId: screening.id,
          })
          onPressOfferCTA?.()
        }

        eventCardProps = {
          onPress,
          isDisabled,
          title: formatHour(beginningDatetime).replace(':', 'h'),
          subtitleLeft,
          subtitleRight,
        }
      }
      return eventCardProps
    })
  }

  return {
    movieScreenings,
    movieScreeningDates,
    selectedDate,
    setSelectedDate,
    getSelectedDateScreenings,
    bookingData,
  }
}
