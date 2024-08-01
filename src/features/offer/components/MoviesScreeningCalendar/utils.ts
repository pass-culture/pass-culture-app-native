import { MOVIE_CALENDAR_PADDING } from 'features/offer/components/MovieCalendar/MovieCalendar'

export const handleMovieCalendarScroll = (
  currentIndex: number,
  flatListWidth: number,
  itemWidth: number
) => {
  const shift = flatListWidth / 2 - MOVIE_CALENDAR_PADDING
  const centerOfSelectedElement = currentIndex * itemWidth + itemWidth / 2

  if (centerOfSelectedElement - shift < 0 || currentIndex === 0) {
    return { offset: 0 }
  }
  return { offset: centerOfSelectedElement - shift }
}
