import React from 'react'

import { RoundToggleButton } from 'features/generalPublicHome/components/RoundToggleButton'
import { render, screen, userEvent } from 'tests/utils'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

jest.useFakeTimers()

describe('<RoundToggleButton />', () => {
  const user = userEvent.setup()

  it('should expose a checked checkbox when on', () => {
    render(
      <RoundToggleButton Icon={MagnifyingGlass} label="Rechercher" checked onPress={jest.fn()} />
    )

    expect(screen.getByRole('checkbox', { name: 'Rechercher' })).toBeChecked()
  })

  it('should expose an unchecked checkbox when off', () => {
    render(
      <RoundToggleButton
        Icon={MagnifyingGlass}
        label="Rechercher"
        checked={false}
        onPress={jest.fn()}
      />
    )

    expect(screen.getByRole('checkbox', { name: 'Rechercher' })).not.toBeChecked()
  })

  it('should call onPress when pressed', async () => {
    const onPress = jest.fn()
    render(
      <RoundToggleButton
        Icon={MagnifyingGlass}
        label="Rechercher"
        checked={false}
        onPress={onPress}
      />
    )

    await user.press(screen.getByRole('checkbox', { name: 'Rechercher' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
