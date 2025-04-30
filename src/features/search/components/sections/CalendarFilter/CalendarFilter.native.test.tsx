import React from 'react'

import { CalendarFilter } from 'features/search/components/sections/CalendarFilter/CalendarFilter'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import { render, screen, userEvent } from 'tests/utils'

const mockSearchState: jest.Mock<{ searchState: Partial<SearchState> }> = jest
  .fn()
  .mockReturnValue({
    searchState: initialSearchState,
  })

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockSearchState(),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('CalendarFilter', () => {
  it('should display description with only beginning date', async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        beginningDatetime: '2025-04-30T00:00:00.000Z',
        endingDatetime: undefined,
      },
    })

    render(<CalendarFilter />)

    expect(await screen.findByText('le mercredi 30 avril')).toBeOnTheScreen()
  })

  it('should display description with beginning and ending dates', async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        beginningDatetime: '2025-04-30T00:00:00.000Z',
        endingDatetime: '2025-05-05T00:00:00.000Z',
      },
    })

    render(<CalendarFilter />)

    expect(await screen.findByText('du mercredi 30 avril au lundi 5 mai')).toBeOnTheScreen()
  })

  it('should open modal when pressing button', async () => {
    render(<CalendarFilter />)

    await user.press(screen.getByText('Dates'))

    expect(screen.getByTestId('calendar')).toBeOnTheScreen()
  })
})
