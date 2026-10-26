import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { BookingDateStep } from './BookingDateStep'

let mockOffer: { stocks: Array<{ beginningDatetime: string; price: number }> } | undefined = {
  stocks: [{ beginningDatetime: '2026-10-20T20:00:00Z', price: 1000 }],
}

let mockCalendarSelectedDate: Date | null | undefined

jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => ({ data: mockOffer }),
}))

jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: () => 10000,
}))

jest.mock('features/bookOffer/components/Calendar/Calendar', () => {
  const ReactActual = jest.requireActual<typeof import('react')>('react')
  const { Pressable, Text } = jest.requireActual<typeof import('react-native')>('react-native')

  return {
    Calendar: ({
      selectedDate,
      onSelectDate,
    }: {
      selectedDate?: Date | null
      onSelectDate?: (date: Date) => void
    }) => {
      mockCalendarSelectedDate = selectedDate
      return ReactActual.createElement(
        Pressable,
        {
          accessibilityRole: 'button',
          onPress: () => onSelectDate?.(new Date(2026, 9, 20)),
        },
        ReactActual.createElement(Text, null, 'Calendrier')
      )
    },
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<BookingDateStep />', () => {
  beforeEach(() => {
    mockOffer = {
      stocks: [{ beginningDatetime: '2026-10-20T20:00:00Z', price: 1000 }],
    }
    mockCalendarSelectedDate = undefined
  })

  it('should render the date step', () => {
    render(<BookingDateStep offerId={1} onSelectDate={jest.fn()} />)

    expect(screen.getByTestId('BookingDateStep')).toBeOnTheScreen()
    expect(screen.getByText('Date')).toBeOnTheScreen()
  })

  it('should render nothing when the offer is missing', () => {
    mockOffer = undefined
    render(<BookingDateStep offerId={1} onSelectDate={jest.fn()} />)

    expect(screen.queryByTestId('BookingDateStep')).not.toBeOnTheScreen()
  })

  it('should pass the parsed selected date to the calendar', () => {
    render(<BookingDateStep offerId={1} selectedDate="2026-10-20" onSelectDate={jest.fn()} />)

    expect(mockCalendarSelectedDate?.getFullYear()).toBe(2026)
    expect(mockCalendarSelectedDate?.getMonth()).toBe(9)
    expect(mockCalendarSelectedDate?.getDate()).toBe(20)
  })

  it('should call onSelectDate with the booking key when a day is chosen', async () => {
    const onSelectDate = jest.fn()
    render(<BookingDateStep offerId={1} onSelectDate={onSelectDate} />)

    await user.press(screen.getByText('Calendrier'))

    expect(onSelectDate).toHaveBeenCalledWith('2026-10-20')
  })
})
