import React from 'react'

import { ControlledFilterSwitch } from 'features/internal/atoms/ControlledFilterSwitch'
import { render, screen, userEvent } from 'tests/utils'

const onChange = jest.fn()
const name = 'testUnit'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ControlledFilterSwitch />', () => {
  it('should call onChange with new value on toggle', async () => {
    render(<ControlledFilterSwitch onChange={onChange} name={name} />)

    const Switch = screen.getByRole('switch')

    await user.press(Switch)

    expect(onChange).toHaveBeenCalledWith(true)

    await user.press(Switch)

    expect(onChange).toHaveBeenCalledWith(false)
  })
})
