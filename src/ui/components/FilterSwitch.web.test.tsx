import React from 'react'

import { fireEvent, render, screen } from 'tests/utils/web'
import FilterSwitch from 'ui/components/FilterSwitch'

const active = false
const toggle = jest.fn()

describe('<FilterSwitch />', () => {
  it('should call toggle when pressing Spacebar on focused switch', () => {
    render(<FilterSwitch active={active} toggle={toggle} />)

    const Switch = screen.getByTestId('Interrupteur')
    fireEvent.focus(Switch)
    fireEvent.keyDown(Switch, { key: 'Spacebar' })

    expect(toggle).toBeCalledTimes(1)
  })
})
