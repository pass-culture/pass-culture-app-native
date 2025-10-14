import React from 'react'

import { render, screen, userEvent } from 'tests/utils'
import { CollapsibleTextButton } from 'ui/components/CollapsibleText/CollapsibleTextButton/CollapsibleTextButton'

const mockOnPress = jest.fn()

const user = userEvent.setup()

jest.useFakeTimers()

describe('CollapsibleTextButton', () => {
  it('should display Voir moins on button text when collapsible text is expanded', () => {
    render(<CollapsibleTextButton expanded onPress={mockOnPress} />)

    expect(screen.getByText('Voir moins')).toBeOnTheScreen()
  })

  it('should display Voir plus on button text when collapsible text is not expanded', () => {
    render(<CollapsibleTextButton expanded={false} onPress={mockOnPress} />)

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should trigger onPress when pressing button', async () => {
    render(<CollapsibleTextButton expanded onPress={mockOnPress} />)

    await user.press(screen.getByText('Voir moins'))

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })
})
