import React from 'react'

import { ControlledFilterSwitch } from 'features/_marketingAndCommunication/atoms/ControlledFilterSwitch'
import { render, fireEvent } from 'tests/utils/web'

const onChange = jest.fn()
const name = 'testUnit'

describe('<ControlledFilterSwitch />', () => {
  it('should call onChange when pressing Spacebar on focused switch', () => {
    const { getByTestId } = render(<ControlledFilterSwitch onChange={onChange} name={name} />)

    const Switch = getByTestId('Interrupteur')
    fireEvent.focus(Switch)
    fireEvent.keyDown(Switch, { key: 'Spacebar' })

    expect(onChange).toHaveBeenNthCalledWith(1, true)
  })
})
