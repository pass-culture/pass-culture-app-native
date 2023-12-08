import React from 'react'

import { LocationFilterChoice } from 'features/internal/marketingAndCommunication/atoms/LocationFilterChoice'
import { LocationMode } from 'libs/location/types'
import { render, fireEvent, screen } from 'tests/utils'

describe('<LocationFilterChoice />', () => {
  it('should call onChange with LocationMode.AROUND_ME or EVERYWHERE', () => {
    const onChange = jest.fn()
    render(<LocationFilterChoice onChange={onChange} />)

    fireEvent.press(screen.getByText('Partout'))

    expect(onChange).toHaveBeenNthCalledWith(1, {
      locationType: LocationMode.EVERYWHERE,
    })
  })
})
