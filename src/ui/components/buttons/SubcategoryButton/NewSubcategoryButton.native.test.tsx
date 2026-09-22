import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'
import { NewSubcategoryButton } from 'ui/components/buttons/SubcategoryButton/NewSubcategoryButton'

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

describe('<NewSubcategoryButton />', () => {
  it('should render label parts when labelParts prop is provided', () => {
    const labelParts = ['Musique', '& Concerts']
    renderNewSubcategoryButton({ labelParts })

    expect(screen.getByText('Musique')).toBeOnTheScreen()
    expect(screen.getByText('& Concerts')).toBeOnTheScreen()
    expect(screen.queryByText('Musique & Concerts')).toBeNull()
  })

  it('should navigate to searchResults with correct params', async () => {
    renderNewSubcategoryButton({})

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

type RenderProps = {
  labelParts?: readonly string[]
}

const renderNewSubcategoryButton = ({ labelParts }: RenderProps = {}) =>
  render(
    reactQueryProviderHOC(
      <NewSubcategoryButton
        label="Mangas"
        backgroundColor={theme.designSystem.color.background.decorative01}
        borderColor={theme.designSystem.color.border.decorative01}
        searchParams={defaultSearchParams}
        onBeforeNavigate={jest.fn()}
        labelParts={labelParts}
      />
    )
  )
