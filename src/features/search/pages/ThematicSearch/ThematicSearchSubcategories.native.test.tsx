import React from 'react'

import { goBack, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { ThematicSearchSubcategories } from 'features/search/pages/ThematicSearch/ThematicSearchSubcategories'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderAsync, screen, userEvent } from 'tests/utils'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ThematicSearchSubcategories/>', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ params: { offerCategories: [SearchGroupNameEnumv2.LIVRES] } })
  })

  it('should display the page title', async () => {
    await renderThematicSearchSubcategories()

    expect(await screen.findAllByText('Tout parcourir')).not.toHaveLength(0)
  })

  it('should display the subcategories of the offer category', async () => {
    await renderThematicSearchSubcategories()

    expect(await screen.findByText('Romans et littérature')).toBeOnTheScreen()
    expect(await screen.findByText('Mangas')).toBeOnTheScreen()
  })

  it('should go back when pressing back button', async () => {
    await renderThematicSearchSubcategories()

    await user.press(await screen.findByLabelText('Revenir en arrière'))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should update searchState when pressing a subcategory button', async () => {
    await renderThematicSearchSubcategories()

    await user.press(await screen.findByText('Romans et littérature'))

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: expect.objectContaining({
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
      }),
    })
  })
})

const renderThematicSearchSubcategories = () =>
  renderAsync(reactQueryProviderHOC(<ThematicSearchSubcategories />))
