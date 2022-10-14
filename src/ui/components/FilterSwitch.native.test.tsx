import React from 'react'

import { fireEvent, render } from 'tests/utils'
import FilterSwitch from 'ui/components/FilterSwitch'

const active = false
const toggle = jest.fn()

describe('<FilterSwitch />', () => {
  it('should call toggle when press on switch', () => {
    const { getByTestId } = render(<FilterSwitch active={active} toggle={toggle} />)

    const Switch = getByTestId('Interrupteur')

    fireEvent.press(Switch)
    expect(toggle).toBeCalledTimes(1)
  })

  it('should not call toggle when switch is disabled and press on', () => {
    const { getByTestId } = render(<FilterSwitch active={active} toggle={toggle} disabled />)

    const Switch = getByTestId('Interrupteur')

    fireEvent.press(Switch)
    expect(toggle).not.toBeCalledTimes(1)
  })
})
