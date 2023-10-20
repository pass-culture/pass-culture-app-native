import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'
import FilterSwitch from 'ui/components/FilterSwitch'

const active = false
const toggle = jest.fn()

describe('<FilterSwitch />', () => {
  it('should call toggle when press on switch', () => {
    render(<FilterSwitch active={active} toggle={toggle} />)

    const Switch = screen.getByTestId('Interrupteur')

    fireEvent.press(Switch)
    expect(toggle).toBeCalledTimes(1)
  })

  it('should not call toggle when switch is disabled and press on', () => {
    render(<FilterSwitch active={active} toggle={toggle} disabled />)

    const Switch = screen.getByTestId('Interrupteur')

    fireEvent.press(Switch)
    expect(toggle).not.toBeCalledTimes(1)
  })
})
