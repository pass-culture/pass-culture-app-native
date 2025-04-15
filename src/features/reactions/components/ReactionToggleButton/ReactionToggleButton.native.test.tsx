import React from 'react'

import { ReactionToggleButton } from 'features/reactions/components/ReactionToggleButton/ReactionToggleButton'
import { render, screen, userEvent } from 'tests/utils'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'

const MockIcon = () => <ThumbUp testID="icon" />
const MockFilledIcon = () => <ThumbUpFilled testID="filledIcon" />

const user = userEvent.setup()
jest.useFakeTimers()

describe('ReactionToggleButton', () => {
  const props = {
    active: false,
    label: 'Toggle Button',
    Icon: MockIcon,
    FilledIcon: MockFilledIcon,
    onPress: jest.fn(),
  }

  it('should render the inactive state correctly', () => {
    render(<ReactionToggleButton {...props} />)

    expect(screen.getByText('Toggle Button')).toBeOnTheScreen()
    expect(screen.getByTestId('icon')).toBeOnTheScreen()
    expect(screen.queryByTestId('filledIcon')).not.toBeOnTheScreen()
  })

  it('should render the active state correctly', () => {
    render(<ReactionToggleButton {...props} active />)

    expect(screen.getByText('Toggle Button')).toBeOnTheScreen()
    expect(screen.queryByTestId('icon')).not.toBeOnTheScreen()
    expect(screen.getByTestId('filledIcon')).toBeOnTheScreen()
  })

  it('should call onPress when pressing the button', async () => {
    const mockOnPress = jest.fn()
    render(<ReactionToggleButton {...props} onPress={mockOnPress} />)

    await user.press(screen.getByText('Toggle Button'))

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })
})
