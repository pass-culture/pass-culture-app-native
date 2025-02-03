import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'
import { SubcategoryButton } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SubcategoryButton/>', () => {
  const defaultSearchParams = {
    ...mockSearchState,
    offerCategories: [SearchGroupNameEnumv2.LIVRES],
    offerNativeCategories: [BooksNativeCategoriesEnum.MANGAS],
  }

  it('should render SubcategoryButton', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButton
          label="Mangas"
          backgroundColor={theme.colors.deepPink}
          borderColor={theme.colors.deepPinkDark}
          searchParams={defaultSearchParams}
        />
      )
    )

    expect(await screen.findByText('Mangas')).toBeOnTheScreen()
  })

  it('should navigate to searchResults with correct params', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButton
          label="Mangas"
          backgroundColor={theme.colors.deepPink}
          borderColor={theme.colors.deepPinkDark}
          searchParams={defaultSearchParams}
        />
      )
    )
    const button = await screen.findByText('Mangas')

    await user.press(button)

    expect(push).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: {
        screen: 'SearchResults',
        params: defaultSearchParams,
      },
    })
  })
})
