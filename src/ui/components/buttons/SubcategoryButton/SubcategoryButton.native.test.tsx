import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { SubcategoryButton } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<SubcategoryButton/>', () => {
  it('should render SubcategoryButton', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButton
          label="Mangas"
          backgroundColor={theme.colors.deepPink}
          borderColor={theme.colors.deepPinkDark}
          nativeCategory={BooksNativeCategoriesEnum.MANGAS}
        />
      )
    )

    expect(await screen.findByText('Mangas')).toBeOnTheScreen()
  })
})
