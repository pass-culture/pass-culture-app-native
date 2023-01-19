import React from 'react'

import { LocationFilterChoice } from 'features/internal/marketingAndCommunication/atoms/LocationFilterChoice'
import { LocationType } from 'features/search/enums'
import { render, fireEvent } from 'tests/utils'

describe('<LocationFilterChoice />', () => {
  it('should call onChange with LocationType.AROUND_ME or EVERYWHERE', () => {
    const onChange = jest.fn()
    const renderAPI = render(<LocationFilterChoice onChange={onChange} />)

    fireEvent.press(renderAPI.getByText('Partout'))
    expect(onChange).toHaveBeenNthCalledWith(1, {
      locationType: LocationType.EVERYWHERE,
    })
  })
})
