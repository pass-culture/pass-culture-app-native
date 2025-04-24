import mockDate from 'mockdate'
import React from 'react'
import { FlatList } from 'react-native'

import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { toMutable } from 'shared/types/toMutable'
import { CustomRenderOptions, fireEvent, render, screen, userEvent } from 'tests/utils'

import { MOVIE_CALENDAR_PADDING } from '../MoviesScreeningCalendar/helpers/handleMovieCalendarScroll'

const dummyDates = toMutable([
  new Date('2024-07-18T00:00:00.000Z'), // Jeudi 18 juillet 2024
  new Date('2024-07-19T00:00:00.000Z'), // Vendredi 19 juillet 2024
  new Date('2024-07-20T00:00:00.000Z'), // Samedi 20 juillet 2024
  new Date('2024-07-21T00:00:00.000Z'), // Dimanche 21 juillet 2024
  new Date('2024-07-22T00:00:00.000Z'), // Lundi 22 juillet 2024
  new Date('2024-07-23T00:00:00.000Z'), // Mardi 23 juillet 2024
  new Date('2024-07-24T00:00:00.000Z'), // Mercredi 24 juillet 2024
  new Date('2024-07-25T00:00:00.000Z'), // Jeudi 25 juillet 2024
  new Date('2024-07-26T00:00:00.000Z'), // Vendredi 26 juillet 2024
  new Date('2024-07-27T00:00:00.000Z'), // Samedi 27 juillet 2024
  new Date('2024-07-28T00:00:00.000Z'), // Dimanche 28 juillet 2024
  new Date('2024-07-29T00:00:00.000Z'), // Lundi 29 juillet 2024
  new Date('2024-07-30T00:00:00.000Z'), // Mardi 30 juillet 2024
  new Date('2024-07-31T00:00:00.000Z'), // Mercredi 31 juillet 2024
  new Date('2024-08-01T00:00:00.000Z'), // Jeudi 1er août 2024
] as const) satisfies Date[]

const DEFAULT_FLATLIST_WIDTH = 1000
const DEFAULT_ITEM_WIDTH = 200

const mockOnTabChange = jest.fn()

const user = userEvent.setup()

jest.useFakeTimers()

describe('<MovieCalendar/>', () => {
  describe('Dates format', () => {
    it('should display the short days of weeks on a mobile screen', () => {
      renderMovieCalendar(dummyDates, { isDesktopViewport: false })

      expect(screen.getAllByText('Mar.').length).toBeGreaterThan(0)
    })

    it('should display the full days of weeks on a desktop screen', () => {
      renderMovieCalendar(dummyDates, { isDesktopViewport: true })

      expect(screen.getAllByText('Mardi').length).toBeGreaterThan(0)
    })
  })

  describe('Right arrow button', () => {
    it('should appear when the component renders before any user interaction', () => {
      renderMovieCalendar(dummyDates, { isDesktopViewport: true })

      fireEvent.scroll(screen.getByTestId('movie-calendar-flat-list'), {
        nativeEvent: {
          contentOffset: { y: 0 },
          contentSize: { height: 3000 },
          layoutMeasurement: { height: 800 },
        },
      })

      expect(screen.getByTestId('movie-calendar-right-arrow')).toBeOnTheScreen()
    })

    it('should not appear when the content reached the end', () => {
      renderMovieCalendar(dummyDates, { isDesktopViewport: true })

      fireEvent.scroll(screen.getByTestId('movie-calendar-flat-list'), {
        nativeEvent: {
          contentOffset: { x: 3000, y: 0 },
          contentSize: { width: 3000 },
          layoutMeasurement: { width: 800 },
        },
      })

      expect(screen.queryByTestId('movie-calendar-right-arrow')).not.toBeOnTheScreen()
    })
  })

  describe('Left arrow button', () => {
    it('should not appear when the component renders before any user interaction', () => {
      renderMovieCalendar(dummyDates, { isDesktopViewport: true })

      fireEvent.scroll(screen.getByTestId('movie-calendar-flat-list'), {
        nativeEvent: {
          contentOffset: { x: 0, y: 0 },
          contentSize: { width: 3000 },
          layoutMeasurement: { width: 800 },
        },
      })

      expect(screen.queryByTestId('movie-calendar-left-arrow')).not.toBeOnTheScreen()
    })

    it('should appear when the content is scrolled', () => {
      renderMovieCalendar(dummyDates, { isDesktopViewport: true })

      fireEvent.scroll(screen.getByTestId('movie-calendar-flat-list'), {
        nativeEvent: {
          contentOffset: { x: 100, y: 0 },
          contentSize: { width: 3000 },
          layoutMeasurement: { width: 800 },
        },
      })

      expect(screen.getByTestId('movie-calendar-left-arrow')).toBeOnTheScreen()
    })
  })

  describe('Animation', () => {
    const mockFlatListRef = {
      current: {
        scrollToEnd: jest.fn(),
        scrollToIndex: jest.fn(),
        scrollToItem: jest.fn(),
        scrollToOffset: jest.fn(),
        recordInteraction: jest.fn(),
        flashScrollIndicators: jest.fn(),
        getScrollResponder: jest.fn(),
        getNativeScrollRef: jest.fn(),
        getScrollableNode: jest.fn(),
        setNativeProps: jest.fn(),
        context: undefined,
        setState: jest.fn(),
        forceUpdate: jest.fn(),
        render: jest.fn(),
        props: {
          data: [],
          renderItem: jest.fn(),
        },
        state: {},
        refs: {},
      },
    }

    const flatListWidth = 1000
    const itemWidth = 200

    beforeEach(() => {
      mockDate.set(dummyDates[0])
    })

    it('should scroll to the middle element when an item is clicked', async () => {
      const itemIndex = 5
      renderMovieCalendar(dummyDates, { isDesktopViewport: false }, mockFlatListRef)
      mockFlatListRef.current.scrollToOffset = jest.fn()

      const firstDateItem = await screen.findByLabelText('Mardi 23 Juillet')
      await user.press(firstDateItem)

      expect(mockOnTabChange).toHaveBeenCalledWith(dummyDates[itemIndex])
      expect(mockFlatListRef.current.scrollToOffset).toHaveBeenCalledWith({
        animated: true,
        offset: MOVIE_CALENDAR_PADDING + itemWidth / 2 + itemIndex * itemWidth - flatListWidth / 2,
      })
    })

    it('should scroll to the start when the offset is less than 0', async () => {
      const itemIndex = 1
      renderMovieCalendar(dummyDates, { isDesktopViewport: false }, mockFlatListRef)
      mockFlatListRef.current.scrollToOffset = jest.fn()

      const firstDateItem = await screen.findByLabelText('Vendredi 19 Juillet')
      await user.press(firstDateItem)

      expect(mockOnTabChange).toHaveBeenCalledWith(dummyDates[itemIndex])
      expect(mockFlatListRef.current.scrollToOffset).toHaveBeenCalledWith({
        animated: true,
        offset: 0,
      })
    })
  })
})

const renderMovieCalendar = (
  dates: Date[],
  theme?: CustomRenderOptions['theme'],
  ref = React.createRef<FlatList | null>()
) => {
  const MovieCalendarWrapper = () => {
    return (
      <MovieCalendar
        dates={dates}
        selectedDate={dates[0]}
        onTabChange={mockOnTabChange}
        flatListRef={ref}
        flatListWidth={DEFAULT_FLATLIST_WIDTH}
        onFlatListLayout={jest.fn()}
        itemWidth={DEFAULT_ITEM_WIDTH}
        onItemLayout={jest.fn()}
      />
    )
  }

  return render(<MovieCalendarWrapper />, { theme })
}
