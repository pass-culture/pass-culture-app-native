import React from 'react'

import { OfferCategoryChoices } from 'features/_marketingAndCommunication/atoms/OfferCategoryChoices'
import { render, fireEvent } from 'tests/utils'

describe('<OfferCategoryChoices />', () => {
  it('should call onChange with proper categories when toggling', () => {
    const onChange = jest.fn()
    const renderAPI = render(<OfferCategoryChoices onChange={onChange} />)

    fireEvent.press(renderAPI.getByText('Beaux-Arts'))
    expect(onChange).toHaveBeenNthCalledWith(1, ['MATERIEL'])
    fireEvent.press(renderAPI.getByText('Conférences, rencontres'))
    expect(onChange).toHaveBeenNthCalledWith(2, ['MATERIEL', 'CONFERENCE'])
    fireEvent.press(renderAPI.getByText('Conférences, rencontres'))
    expect(onChange).toHaveBeenNthCalledWith(3, ['MATERIEL'])
  })
})
