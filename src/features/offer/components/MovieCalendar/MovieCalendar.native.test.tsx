import React from 'react'
import { FlatList } from 'react-native'

import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { render, act, screen, CustomRenderOptions, fireEvent } from 'tests/utils'

const dummyDates: Date[] = [
  new Date(1296518400000), // 1er février 2011 (Mardi)
  new Date(1330627200000), // 1er mars 2012 (Jeudi)
  new Date(1380912000000), // 4 octobre 2013 (Vendredi)
  new Date(1417286400000), // 30 novembre 2014 (Dimanche)
  new Date(1464739200000), // 31 mai 2016 (Mardi)
  new Date(1509532800000), // 1er novembre 2017 (Mercredi)
  new Date(1559376000000), // 1er juin 2019 (Samedi)
  new Date(1606780800000), // 1er décembre 2022 (Jeudi)
  new Date(1654099200000), // 31 mai 2024 (Vendredi)
]

const mockOnTabChange = jest.fn()

describe('<MovieCalendar/>', () => {
  it('should render MovieCalendar', async () => {
    renderMovieCalendar(dummyDates)
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  describe('Dates format', () => {
    it('should display the short days of weeks on a mobile screen', async () => {
      renderMovieCalendar(dummyDates, { isDesktopViewport: false })

      expect(screen.getAllByText('Mar.').length).toBeGreaterThan(0)
    })

    it('should display the full days of weeks on a desktop screen', async () => {
      renderMovieCalendar(dummyDates, { isDesktopViewport: true })

      expect(screen.getAllByText('Mardi').length).toBeGreaterThan(0)
    })
  })

  describe('Right arrow button', () => {
    it('should appear when the component renders before any user interaction', async () => {
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

    it('should not appear when the content reached the end', async () => {
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
    it('should not appear when the component renders before any user interaction', async () => {
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

    it('should appear when the content is scrolled', async () => {
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
})

const renderMovieCalendar = (dates: Date[], theme?: CustomRenderOptions['theme']) => {
  const TestWrapper = () => {
    const ref = React.useRef<FlatList | null>(null)

    return (
      <MovieCalendar
        dates={dates}
        selectedDate={dates[0]}
        onTabChange={mockOnTabChange}
        flatListRef={ref}
      />
    )
  }

  return render(<TestWrapper />, { theme })
}
