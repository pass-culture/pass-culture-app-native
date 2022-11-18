import React from 'react'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { initialSearchState } from 'features/search/context/reducer/reducer'
import { SearchState } from 'features/search/types'
import { render } from 'tests/utils'

import { DateHour } from './DateHour'

const mockSearchState: jest.Mock<{ searchState: Partial<SearchState> }> = jest
  .fn()
  .mockReturnValue({
    searchState: initialSearchState,
  })

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => mockSearchState(),
}))

describe('DateHour component', () => {
  it('should render correctly', () => {
    expect(render(<DateHour />)).toMatchSnapshot()
  })

  it('should not display anything when nothing selected', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: null,
        date: null,
      },
    })

    expect(render(<DateHour />)).toMatchSnapshot()
  })

  it('should display only date when only date is selected', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: null,
        date: {
          option: DATE_FILTER_OPTIONS.TODAY,
          selectedDate: new Date('2022-03-03').toISOString(),
        },
      },
    })

    const { getByText } = render(<DateHour />)

    expect(getByText('le Jeudi 3 mars 2022')).toBeTruthy()
  })

  it('should display only hours when only hours is selected', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: [9, 20],
        date: null,
      },
    })

    const { getByText } = render(<DateHour />)

    expect(getByText('entre 9h et 20h')).toBeTruthy()
  })

  it('should display correct text with week selected', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: null,
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
          selectedDate: new Date('2022-03-03').toISOString(),
        },
      },
    })

    const { getByText } = render(<DateHour />)

    expect(getByText('cette semaine')).toBeTruthy()
  })

  it('should display correct text with week-end selected', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: null,
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
          selectedDate: new Date('2022-03-03').toISOString(),
        },
      },
    })

    const { getByText } = render(<DateHour />)

    expect(getByText('ce week-end')).toBeTruthy()
  })
})
