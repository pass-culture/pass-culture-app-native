import React, { ComponentProps } from 'react'

import { DateFilterBar } from 'features/generalPublicHome/components/DateFilterBar'
import { render, screen, userEvent } from 'tests/utils'

jest.useFakeTimers()

const defaultProps: ComponentProps<typeof DateFilterBar> = {
  isSearchOpen: false,
  isCalendarOpen: false,
  onToggleSearch: jest.fn(),
  onToggleCalendar: jest.fn(),
  datePresetItems: [
    { label: 'Aujourd’hui', isSelected: false, onPress: jest.fn() },
    { label: 'Demain', isSelected: true, onPress: jest.fn() },
  ],
}

describe('<DateFilterBar />', () => {
  const user = userEvent.setup()

  it('should expose the open state of the search and calendar toggles', () => {
    render(<DateFilterBar {...defaultProps} isSearchOpen />)

    expect(screen.getByRole('checkbox', { name: 'Rechercher' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Choisir une date' })).not.toBeChecked()
  })

  it('should call onToggleSearch when pressing the search toggle', async () => {
    const onToggleSearch = jest.fn()
    render(<DateFilterBar {...defaultProps} onToggleSearch={onToggleSearch} />)

    await user.press(screen.getByRole('checkbox', { name: 'Rechercher' }))

    expect(onToggleSearch).toHaveBeenCalledTimes(1)
  })

  it('should call onToggleCalendar when pressing the calendar toggle', async () => {
    const onToggleCalendar = jest.fn()
    render(<DateFilterBar {...defaultProps} onToggleCalendar={onToggleCalendar} />)

    await user.press(screen.getByRole('checkbox', { name: 'Choisir une date' }))

    expect(onToggleCalendar).toHaveBeenCalledTimes(1)
  })

  it('should display one chip per date preset with its selected state', () => {
    render(<DateFilterBar {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'Aujourd’hui' })).not.toBeSelected()
    expect(screen.getByRole('button', { name: 'Demain' })).toBeSelected()
  })

  it('should call the onPress of the pressed date preset', async () => {
    const onPressToday = jest.fn()
    render(
      <DateFilterBar
        {...defaultProps}
        datePresetItems={[{ label: 'Aujourd’hui', isSelected: false, onPress: onPressToday }]}
      />
    )

    await user.press(screen.getByRole('button', { name: 'Aujourd’hui' }))

    expect(onPressToday).toHaveBeenCalledTimes(1)
  })
})
