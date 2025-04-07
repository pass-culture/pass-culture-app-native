import React from 'react'

import { LocationFilterChoice } from 'features/internal/atoms/LocationFilterChoice'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<LocationFilterChoice />', () => {
  it('should call onChange with LocationMode.AROUND_ME or EVERYWHERE', async () => {
    const onChange = jest.fn()
    render(<LocationFilterChoice onChange={onChange} />)

    await user.press(screen.getByText(LocationLabel.everywhereLabel))

    expect(onChange).toHaveBeenNthCalledWith(1, {
      locationType: LocationMode.EVERYWHERE,
    })
  })
})
