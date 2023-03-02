import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { render, screen } from 'tests/utils'

import { DateHour } from './DateHour'

const mockSearchState: jest.Mock<{ searchState: Partial<SearchState> }> = jest
  .fn()
  .mockReturnValue({
    searchState: initialSearchState,
  })

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockSearchState(),
}))

describe('DateHour component', () => {
  it('should display only date when only date is selected', async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: null,
        date: {
          option: DATE_FILTER_OPTIONS.TODAY,
          selectedDate: new Date('2022-03-03').toISOString(),
        },
      },
    })

    render(<DateHour />)

    expect(await screen.findByText('le Jeudi 3 mars 2022')).toBeTruthy()
  })

  it('should display only hours when only hours is selected', async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: [9, 20],
        date: null,
      },
    })

    render(<DateHour />)

    expect(await screen.findByText('entre 9h et 20h')).toBeTruthy()
  })

  it('should display correct text with week selected', async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: null,
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
          selectedDate: new Date('2022-03-03').toISOString(),
        },
      },
    })

    render(<DateHour />)

    expect(await screen.findByText('cette semaine')).toBeTruthy()
  })

  it('should display correct text with week-end selected', async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: null,
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
          selectedDate: new Date('2022-03-03').toISOString(),
        },
      },
    })

    render(<DateHour />)

    expect(await screen.findByText('ce week-end')).toBeTruthy()
  })
})
