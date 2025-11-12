import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { OfferNativeCategoryChoices } from 'features/internal/atoms/OfferNativeCategoryChoices'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('queries/subcategories/useSubcategoriesQuery')

jest.mock('libs/firebase/analytics/analytics')
const user = userEvent.setup()

describe('<OfferNativeCategoryChoices />', () => {
  jest.useFakeTimers()

  it('should call onChange with proper subcategory when toggling', async () => {
    const onChange = jest.fn()
    render(
      <OfferNativeCategoryChoices
        onChange={onChange}
        categories={[SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]}
      />
    )

    await user.press(screen.getByText('Arts visuels'))

    expect(onChange).toHaveBeenNthCalledWith(1, ['ARTS_VISUELS'])

    await user.press(screen.getByText('Matériels créatifs'))

    expect(onChange).toHaveBeenNthCalledWith(2, ['MATERIELS_CREATIFS'])

    await user.press(screen.getByText('Matériels créatifs'))

    expect(onChange).toHaveBeenNthCalledWith(3, [])
  })
})
