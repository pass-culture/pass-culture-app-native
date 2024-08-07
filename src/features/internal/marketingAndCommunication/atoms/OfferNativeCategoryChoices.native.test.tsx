import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { OfferNativeCategoryChoices } from 'features/internal/marketingAndCommunication/atoms/OfferNativeCategoryChoices'
import { render, fireEvent, screen } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories')

jest.mock('libs/firebase/analytics/analytics')

describe('<OfferNativeCategoryChoices />', () => {
  it('should match snapshot', () => {
    const onChange = jest.fn()
    render(
      <OfferNativeCategoryChoices
        onChange={onChange}
        categories={[SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should call onChange with proper subcategory when toggling', () => {
    const onChange = jest.fn()
    render(
      <OfferNativeCategoryChoices
        onChange={onChange}
        categories={[SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]}
      />
    )

    fireEvent.press(screen.getByText('Arts visuels'))

    expect(onChange).toHaveBeenNthCalledWith(1, ['ARTS_VISUELS'])

    fireEvent.press(screen.getByText('Matériels créatifs'))

    expect(onChange).toHaveBeenNthCalledWith(2, ['MATERIELS_CREATIFS'])

    fireEvent.press(screen.getByText('Matériels créatifs'))

    expect(onChange).toHaveBeenNthCalledWith(3, [])
  })
})
