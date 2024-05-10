import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchN1Books } from 'features/search/pages/Search/SearchN1Books/SearchN1Books'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('<SearchN1Books/>', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
    useRoute.mockImplementation(() => ({
      params: { offerCategories: SearchGroupNameEnumv2.LIVRES },
    }))
  })

  it('should render SearchN1Books', async () => {
    render(reactQueryProviderHOC(<SearchN1Books />))

    await screen.findByText('Romans et littérature')

    expect(screen).toMatchSnapshot()
  })

  it('should update SearchState with correct data', async () => {
    render(reactQueryProviderHOC(<SearchN1Books />))
    const subcategoryButton = await screen.findByText('Romans et littérature')
    await act(() => fireEvent.press(subcategoryButton))
    await screen.findByText('Romans et littérature')

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        ...initialSearchState,
        offerCategories: SearchGroupNameEnumv2.LIVRES,
        offerGenreTypes: [],
        isFullyDigitalOffersCategory: undefined,
        offerNativeCategories: ['ROMANS_ET_LITTERATURE'],
      },
      type: 'SET_STATE',
    })
  })

  it('should navigate properly', async () => {
    render(reactQueryProviderHOC(<SearchN1Books />))
    const subcategoryButton = await screen.findByText('Romans et littérature')

    await act(() => fireEvent.press(subcategoryButton))
    await screen.findByText('Romans et littérature')

    const expectedResult = {
      params: {
        ...initialSearchState,
        accessibilityFilter: defaultDisabilitiesProperties,
        offerCategories: SearchGroupNameEnumv2.LIVRES,
        offerGenreTypes: [],
        offerNativeCategories: ['ROMANS_ET_LITTERATURE'],
        isFullyDigitalOffersCategory: undefined,
      },
      screen: 'SearchResults',
    }

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: expectedResult,
    })
  })
})
