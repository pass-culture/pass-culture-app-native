import React from 'react'

import { OfferCategoryChoices } from 'features/_marketingAndCommunication/atoms/OfferCategoryChoices'
import { render, fireEvent } from 'tests/utils'

describe('<OfferCategoryChoices />', () => {
  it('should match snapshot', () => {
    const onChange = jest.fn()
    const renderAPI = render(<OfferCategoryChoices onChange={onChange} />)

    expect(renderAPI).toMatchSnapshot()
  })
  it('should call onChange with proper categories when toggling', () => {
    const onChange = jest.fn()
    const renderAPI = render(<OfferCategoryChoices onChange={onChange} />)

    fireEvent.press(renderAPI.getByText('Arts & loisirs créatifs'))
    expect(onChange).toHaveBeenNthCalledWith(1, ['ARTS_LOISIRS_CREATIFS'])
    fireEvent.press(renderAPI.getByText('Conférences & rencontres'))
    expect(onChange).toHaveBeenNthCalledWith(2, ['ARTS_LOISIRS_CREATIFS', 'RENCONTRES_CONFERENCES'])
    fireEvent.press(renderAPI.getByText('Conférences & rencontres'))
    expect(onChange).toHaveBeenNthCalledWith(3, ['ARTS_LOISIRS_CREATIFS'])
  })
})
