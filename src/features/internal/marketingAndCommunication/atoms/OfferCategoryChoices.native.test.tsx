import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { OfferCategoryChoices } from 'features/internal/marketingAndCommunication/atoms/OfferCategoryChoices'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen } from 'tests/utils'

let mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('<OfferCategoryChoices />', () => {
  afterEach(() => {
    mockData = PLACEHOLDER_DATA
  })

  it('should call onChange with proper category when toggling', () => {
    const onChange = jest.fn()
    render(<OfferCategoryChoices onChange={onChange} selection={undefined} />)

    fireEvent.press(screen.getByText('Arts & loisirs créatifs'))

    expect(onChange).toHaveBeenNthCalledWith(1, 'ARTS_LOISIRS_CREATIFS')

    fireEvent.press(screen.getByText('Conférences & rencontres'))

    expect(onChange).toHaveBeenNthCalledWith(2, 'RENCONTRES_CONFERENCES')
  })

  it('should deleselect category when toggling again a selected category', async () => {
    const onChange = jest.fn()
    render(
      <OfferCategoryChoices
        onChange={onChange}
        selection={SearchGroupNameEnumv2.RENCONTRES_CONFERENCES}
      />
    )

    fireEvent.press(screen.getByText('Conférences & rencontres'))

    expect(onChange).toHaveBeenNthCalledWith(1, undefined)
  })

  it('should not return labels when no categories sent by backend', () => {
    mockData = { ...mockData, searchGroups: [] }
    const onChange = jest.fn()
    render(<OfferCategoryChoices onChange={onChange} selection={undefined} />)

    expect(screen.queryByText('Arts & loisirs créatifs')).not.toBeOnTheScreen()
    expect(screen.queryByText('Conférences & rencontres')).not.toBeOnTheScreen()
  })
})
