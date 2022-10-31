import React from 'react'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { render } from 'tests/utils'

import { DateHour } from '..//DateHour'

const mockSearchState = jest.fn().mockReturnValue({
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
          selectedDate: new Date('2022-03-03'),
        },
      },
    })

    const { queryByText } = render(<DateHour />)

    expect(queryByText('le Jeudi 3 mars 2022')).toBeDefined()
  })

  it('should display only hours when only hours is selected', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        timeRange: [9, 20],
        date: null,
      },
    })

    const { queryByText } = render(<DateHour />)

    expect(queryByText('de 9h à 20h')).toBeDefined()
  })
})
