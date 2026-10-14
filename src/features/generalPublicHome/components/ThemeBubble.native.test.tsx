import React from 'react'

import { ThemeBubble } from 'features/generalPublicHome/components/ThemeBubble'
import { render, screen, userEvent } from 'tests/utils'
import { Museum } from 'ui/svg/icons/venueAndCategories/Museum'

jest.useFakeTimers()

describe('<ThemeBubble />', () => {
  const user = userEvent.setup()

  it('should display the label', () => {
    render(<ThemeBubble label="Visites" Icon={Museum} onPress={jest.fn()} />)

    expect(screen.getByText('Visites')).toBeOnTheScreen()
  })

  it('should call onPress when pressed', async () => {
    const onPress = jest.fn()
    render(<ThemeBubble label="Visites" Icon={Museum} onPress={onPress} />)

    await user.press(screen.getByRole('button', { name: 'Visites' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
