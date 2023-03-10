import React from 'react'

import { ControlledFilterSwitch } from 'features/internal/marketingAndCommunication/atoms/ControlledFilterSwitch'
import { render, fireEvent, screen } from 'tests/utils/web'

const onChange = jest.fn()
const name = 'testUnit'

describe('<ControlledFilterSwitch />', () => {
  it('should call onChange when pressing Spacebar on focused switch', () => {
    render(<ControlledFilterSwitch onChange={onChange} name={name} />)

    const Switch = screen.getByTestId('Interrupteur')
    fireEvent.focus(Switch)
    fireEvent.keyDown(Switch, { key: 'Spacebar' })

    expect(onChange).toHaveBeenNthCalledWith(1, true)
  })
})
