import React from 'react'

import { render, screen, userEvent } from 'tests/utils'
import FilterSwitch from 'ui/components/FilterSwitch'

const active = false
const toggle = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<FilterSwitch />', () => {
  it('should call toggle when press on switch', async () => {
    render(<FilterSwitch active={active} toggle={toggle} />)

    const Switch = screen.getByRole('switch')

    await user.press(Switch)

    expect(toggle).toHaveBeenCalledTimes(1)
  })

  it('should not call toggle when switch is disabled and press on', async () => {
    render(<FilterSwitch active={active} toggle={toggle} disabled />)

    const Switch = screen.getByRole('switch')

    await user.press(Switch)

    expect(toggle).not.toHaveBeenCalledTimes(1)
  })
})
