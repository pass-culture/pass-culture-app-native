import React from 'react'

import { OfferTypeChoices } from 'features/_marketingAndCommunication/atoms/OfferTypeChoices'
import { OfferType } from 'features/search/enums'
import { render, fireEvent } from 'tests/utils'

describe('<OfferCategoryChoices />', () => {
  it('should match snapshot', () => {
    const onChange = jest.fn()
    const renderAPI = render(<OfferTypeChoices onChange={onChange} />)

    expect(renderAPI).toMatchSnapshot()
  })

  it('should call onChange with proper offer types when toggling', () => {
    const onChange = jest.fn()
    const renderAPI = render(<OfferTypeChoices onChange={onChange} />)
    fireEvent.press(renderAPI.getByText(OfferType.DIGITAL))
    expect(onChange).toHaveBeenNthCalledWith(1, { isDigital: true, isEvent: false, isThing: false })
    fireEvent.press(renderAPI.getByText(OfferType.EVENT))
    expect(onChange).toHaveBeenNthCalledWith(2, { isDigital: true, isEvent: true, isThing: false })
    fireEvent.press(renderAPI.getByText(OfferType.THING))
    expect(onChange).toHaveBeenNthCalledWith(3, { isDigital: true, isEvent: true, isThing: true })
    fireEvent.press(renderAPI.getByText(OfferType.THING))
    expect(onChange).toHaveBeenNthCalledWith(4, { isDigital: true, isEvent: true, isThing: false })
  })
})
