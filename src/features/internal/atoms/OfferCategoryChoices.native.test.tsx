import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { OfferCategoryChoices } from 'features/internal/atoms/OfferCategoryChoices'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { userEvent, render, screen } from 'tests/utils'

let mockData = PLACEHOLDER_DATA
jest.mock('queries/subcategories/useSubcategoriesQuery', () => ({
  useSubcategoriesQuery: () => ({
    data: mockData,
  }),
}))
const user = userEvent.setup()

describe('<OfferCategoryChoices />', () => {
  jest.useFakeTimers()

  afterEach(() => {
    mockData = PLACEHOLDER_DATA
  })

  it('should change selected category when toggling', async () => {
    const onChange = jest.fn()
    render(<OfferCategoryChoices onChange={onChange} selection={[]} />)

    await user.press(screen.getByText('Arts & loisirs créatifs'))

    expect(onChange).toHaveBeenNthCalledWith(1, ['ARTS_LOISIRS_CREATIFS'])

    await user.press(screen.getByText('Conférences & rencontres'))

    expect(onChange).toHaveBeenNthCalledWith(2, ['RENCONTRES_CONFERENCES'])
  })

  it('should deleselect category when toggling again a selected category', async () => {
    const onChange = jest.fn()
    render(
      <OfferCategoryChoices
        onChange={onChange}
        selection={[SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]}
      />
    )

    await user.press(screen.getByText('Conférences & rencontres'))

    expect(onChange).toHaveBeenNthCalledWith(1, [])
  })

  it('should not return labels when no categories sent by backend', () => {
    mockData = { ...mockData, searchGroups: [] }
    const onChange = jest.fn()
    render(<OfferCategoryChoices onChange={onChange} selection={[]} />)

    expect(screen.queryByText('Arts & loisirs créatifs')).not.toBeOnTheScreen()
    expect(screen.queryByText('Conférences & rencontres')).not.toBeOnTheScreen()
  })
})
