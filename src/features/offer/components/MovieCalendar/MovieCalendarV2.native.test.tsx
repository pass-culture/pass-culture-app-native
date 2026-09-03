import { FlashListRef } from '@shopify/flash-list'
import mockDate from 'mockdate'
import React from 'react'

import { MovieCalendarV2 } from 'features/offer/components/MovieCalendar/MovieCalendarV2'
import { toMutable } from 'shared/types/toMutable'
import type { CustomRenderOptions } from 'tests/utils'
import { fireEvent, render, screen, userEvent } from 'tests/utils'

const dummyDates = toMutable([
  '2024-07-18', // Jeudi 18 juillet 2024
  '2024-07-19', // Vendredi 19 juillet 2024
  '2024-07-20', // Samedi 20 juillet 2024
  '2024-07-21', // Dimanche 21 juillet 2024
  '2024-07-22', // Lundi 22 juillet 2024
  '2024-07-23', // Mardi 23 juillet 2024
  '2024-07-24', // Mercredi 24 juillet 2024
  '2024-07-25', // Jeudi 25 juillet 2024
  '2024-07-26', // Vendredi 26 juillet 2024
  '2024-07-27', // Samedi 27 juillet 2024
  '2024-07-28', // Dimanche 28 juillet 2024
  '2024-07-29', // Lundi 29 juillet 2024
  '2024-07-30', // Mardi 30 juillet 2024
  '2024-07-31', // Mercredi 31 juillet 2024
  '2024-08-01', // Jeudi 1er août 2024
] as const) satisfies string[]

const DEFAULT_FLATLIST_WIDTH = 1000
const DEFAULT_ITEM_WIDTH = 200

const mockOnTabChange = jest.fn()

const user = userEvent.setup()

jest.useFakeTimers()

describe('<MovieCalendarV2/>', () => {
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
      const MOVIE_CALENDAR_PADDING = 24

      renderMovieCalendar(
        dummyDates,
        { isDesktopViewport: false },
        mockFlatListRef as unknown as React.RefObject<FlashListRef<string>>
      )
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
      renderMovieCalendar(
        dummyDates,
        { isDesktopViewport: false },
        mockFlatListRef as unknown as React.RefObject<FlashListRef<string>>
      )
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
  dates: string[],
  theme?: CustomRenderOptions['theme'],
  ref = React.createRef<FlashListRef<string> | null>()
) => {
  const MovieCalendarWrapper = () => {
    return (
      <MovieCalendarV2
        dates={dates}
        selectedDate={dates[0]}
        onTabChange={mockOnTabChange}
        listRef={ref}
        listWidth={DEFAULT_FLATLIST_WIDTH}
        onFlatListLayout={jest.fn()}
        itemWidth={DEFAULT_ITEM_WIDTH}
        onItemLayout={jest.fn()}
      />
    )
  }

  return render(<MovieCalendarWrapper />, { theme })
}
