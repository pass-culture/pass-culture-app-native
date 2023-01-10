import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { OfferNativeCategoryChoices } from 'features/_marketingAndCommunication/atoms/OfferNativeCategoryChoices'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { render, fireEvent } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('<OfferNativeCategoryChoices />', () => {
  it('should match snapshot', () => {
    const onChange = jest.fn()
    const renderAPI = render(
      <OfferNativeCategoryChoices
        onChange={onChange}
        categories={[SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]}
      />
    )

    expect(renderAPI).toMatchSnapshot()
  })
  it('should call onChange with proper subcategory when toggling', () => {
    const onChange = jest.fn()
    const renderAPI = render(
      <OfferNativeCategoryChoices
        onChange={onChange}
        categories={[SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]}
      />
    )

    fireEvent.press(renderAPI.getByText('Arts visuels'))
    expect(onChange).toHaveBeenNthCalledWith(1, ['ARTS_VISUELS'])
    fireEvent.press(renderAPI.getByText('Matériels créatifs'))
    expect(onChange).toHaveBeenNthCalledWith(2, ['MATERIELS_CREATIFS'])
    fireEvent.press(renderAPI.getByText('Matériels créatifs'))
    expect(onChange).toHaveBeenNthCalledWith(3, [])
  })
})
