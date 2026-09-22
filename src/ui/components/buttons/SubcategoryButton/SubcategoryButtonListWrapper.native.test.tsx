import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { ThematicSearchCategories } from 'features/navigation/navigators/SearchStackNavigator/types'
import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderAsync, screen, userEvent } from 'tests/utils'
import { SubcategoryButtonListWrapper } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonListWrapper'

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

describe('<SubcategoryButtonListWrapper/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display "Films à l’affiche" when offerCategory is "Cinema"', async () => {
    await renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.CINEMA)

    expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
  })

  it('should display "Romans et littérature" when offerCategory is "Livres"', async () => {
    await renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    expect(await screen.findByText('Romans et littérature')).toBeOnTheScreen()
  })

  it('should display "Tout parcourir" header with a "Voir tout" button', async () => {
    await renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    expect(await screen.findByText('Tout parcourir')).toBeOnTheScreen()
    expect(screen.getByText('Voir tout')).toBeOnTheScreen()
  })

  it('should navigate directly to ThematicSearchSubcategories when pressing "Voir tout"', async () => {
    await renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    await user.press(await screen.findByText('Voir tout'))

    expect(navigate).toHaveBeenCalledWith('ThematicSearchSubcategories', {
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
    })
  })

  it('should log ClickSeeAll event when pressing "Voir tout"', async () => {
    await renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    await user.press(await screen.findByText('Voir tout'))

    expect(analytics.logClickSeeAll).toHaveBeenCalledWith({
      type: 'categories',
      moduleName: 'Tout parcourir',
      from: 'thematicsearch',
    })
  })

  it('should use subcategory button when wipNewCategoryBlocks FF deactivated', async () => {
    await renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    const button = await screen.findByLabelText('Romans et littérature')

    expect(button).toBeOnTheScreen()
    expect(button).toHaveStyle({ backgroundColor: '#ffa5c0' })
  })

  it('should use new subcategory button when wipNewCategoryBlocks FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_CATEGORY_BLOCKS])
    await renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    const button = await screen.findByLabelText('Sous-catégorie Romans et littérature')

    expect(button).toBeOnTheScreen()
    expect(button).toHaveStyle({ backgroundColor: '#f2497c' })
  })

  it.skip('should update searchState with correct params', async () => {
    await renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    await screen.findByText('Romans et littérature')

    await user.press(await screen.findByText('Mangas'))

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: expect.objectContaining({
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [BooksNativeCategoriesEnum.MANGAS],
      }),
    })
  })
})

const renderSubcategoryButtonListWrapper = (offerCategory: ThematicSearchCategories) =>
  renderAsync(reactQueryProviderHOC(<SubcategoryButtonListWrapper offerCategory={offerCategory} />))
