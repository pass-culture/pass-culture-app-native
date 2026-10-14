import React from 'react'

import { FilterChip } from 'features/generalPublicHome/components/FilterChip'
import { render, screen, userEvent } from 'tests/utils'

jest.useFakeTimers()

describe('<FilterChip />', () => {
  const user = userEvent.setup()

  it('should display the label', () => {
    render(<FilterChip label="Demain" isSelected={false} onPress={jest.fn()} />)

    expect(screen.getByText('Demain')).toBeOnTheScreen()
  })

  it('should expose a selected button when selected', () => {
    render(<FilterChip label="Demain" isSelected onPress={jest.fn()} />)

    expect(screen.getByRole('button', { name: 'Demain' })).toBeSelected()
  })

  it('should expose an unselected button when not selected', () => {
    render(<FilterChip label="Demain" isSelected={false} onPress={jest.fn()} />)

    expect(screen.getByRole('button', { name: 'Demain' })).not.toBeSelected()
  })

  it('should call onPress when pressed', async () => {
    const onPress = jest.fn()
    render(<FilterChip label="Demain" isSelected={false} onPress={onPress} />)

    await user.press(screen.getByRole('button', { name: 'Demain' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
