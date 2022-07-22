import React from 'react'

import { ControlledFilterSwitch } from 'features/_marketingAndCommunication/atoms/ControlledFilterSwitch'
import { render, fireEvent } from 'tests/utils'

const onChange = jest.fn()
const name = 'testUnit'

describe('<ControlledFilterSwitch />', () => {
  it('should call onChange with new value on toggle', () => {
    const { getByTestId } = render(<ControlledFilterSwitch onChange={onChange} name={name} />)

    const Switch = getByTestId('Interrupteur')

    fireEvent.press(Switch)
    expect(onChange).toBeCalledWith(true)

    fireEvent.press(Switch)
    expect(onChange).toBeCalledWith(false)
  })
})
