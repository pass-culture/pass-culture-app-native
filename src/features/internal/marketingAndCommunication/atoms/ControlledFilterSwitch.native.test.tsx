import React from 'react'

import { ControlledFilterSwitch } from 'features/internal/marketingAndCommunication/atoms/ControlledFilterSwitch'
import { render, fireEvent, screen } from 'tests/utils'

const onChange = jest.fn()
const name = 'testUnit'

describe('<ControlledFilterSwitch />', () => {
  it('should call onChange with new value on toggle', () => {
    render(<ControlledFilterSwitch onChange={onChange} name={name} />)

    const Switch = screen.getByTestId('Interrupteur')

    fireEvent.press(Switch)

    expect(onChange).toHaveBeenCalledWith(true)

    fireEvent.press(Switch)

    expect(onChange).toHaveBeenCalledWith(false)
  })
})
