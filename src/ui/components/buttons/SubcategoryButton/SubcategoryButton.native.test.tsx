import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'
import { SubcategoryButton } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'

jest.mock('libs/firebase/analytics/analytics')

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const defaultSearchParams = {
  ...mockSearchState,
  offerCategories: [SearchGroupNameEnumv2.LIVRES],
  offerNativeCategories: [BooksNativeCategoriesEnum.MANGAS],
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SubcategoryButton/>', () => {
  it('should render SubcategoryButton', async () => {
    renderSubcategoryButton()

    expect(await screen.findByText('Mangas')).toBeOnTheScreen()
  })

  it('should navigate to searchResults with correct params', async () => {
    renderSubcategoryButton()

    const button = await screen.findByText('Mangas')

    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: {
        screen: 'SearchResults',
        params: defaultSearchParams,
      },
    })
  })
})

const renderSubcategoryButton = () =>
  render(
    reactQueryProviderHOC(
      <SubcategoryButton
        label="Mangas"
        backgroundColor={theme.designSystem.color.background.decorative01}
        borderColor={theme.designSystem.color.border.decorative01}
        searchParams={defaultSearchParams}
        onBeforeNavigate={jest.fn()}
      />
    )
  )
