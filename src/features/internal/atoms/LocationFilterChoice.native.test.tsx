import React from 'react'

import { LocationFilterChoice } from 'features/internal/atoms/LocationFilterChoice'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { render, fireEvent, screen } from 'tests/utils'

describe('<LocationFilterChoice />', () => {
  it('should call onChange with LocationMode.AROUND_ME or EVERYWHERE', () => {
    const onChange = jest.fn()
    render(<LocationFilterChoice onChange={onChange} />)

    fireEvent.press(screen.getByText(LocationLabel.everywhereLabel))

    expect(onChange).toHaveBeenNthCalledWith(1, {
      locationType: LocationMode.EVERYWHERE,
    })
  })
})
