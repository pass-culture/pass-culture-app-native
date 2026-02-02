export const handleMovieCalendarScroll = (
  currentIndex: number,
  flatListWidth: number,
  itemWidth: number,
  movieCalendarPadding: number
) => {
  const shift = flatListWidth / 2 - movieCalendarPadding
  const centerOfSelectedElement = currentIndex * itemWidth + itemWidth / 2

  if (centerOfSelectedElement - shift < 0 || currentIndex === 0) {
    return { offset: 0 }
  }
  return { offset: centerOfSelectedElement - shift }
}
