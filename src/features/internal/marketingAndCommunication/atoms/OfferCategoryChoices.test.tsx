import React from 'react'

import { OfferCategoryChoices } from 'features/internal/marketingAndCommunication/atoms/OfferCategoryChoices'
import { render, fireEvent } from 'tests/utils'

describe('<OfferCategoryChoices />', () => {
  it('should match snapshot', () => {
    const onChange = jest.fn()
    const renderAPI = render(<OfferCategoryChoices onChange={onChange} />)

    expect(renderAPI).toMatchSnapshot()
  })
  it('should call onChange with proper category when toggling', () => {
    const onChange = jest.fn()
    const renderAPI = render(<OfferCategoryChoices onChange={onChange} />)

    fireEvent.press(renderAPI.getByText('Arts & loisirs créatifs'))
    expect(onChange).toHaveBeenNthCalledWith(1, ['ARTS_LOISIRS_CREATIFS'])
    fireEvent.press(renderAPI.getByText('Conférences & rencontres'))
    expect(onChange).toHaveBeenNthCalledWith(2, ['RENCONTRES_CONFERENCES'])
    fireEvent.press(renderAPI.getByText('Conférences & rencontres'))
    expect(onChange).toHaveBeenNthCalledWith(3, [])
  })
})
