import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import * as useSearch from 'features/search/context/SearchWrapper'
import { SearchN1, searchN1Placeholders } from 'features/search/pages/Search/SearchN1/SearchN1'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('libs/firebase/analytics/analytics')
jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.spyOn(useSearch, 'useSearch').mockReturnValue({
  searchState: mockSearchState,
  dispatch: mockDispatch,
  resetSearch: jest.fn(),
  isFocusOnSuggestions: false,
  showSuggestions: jest.fn(),
  hideSuggestions: jest.fn(),
})

describe('<SearchN1/>', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
    useRoute.mockImplementation(() => ({
      params: { offerCategories: [SearchGroupNameEnumv2.LIVRES] },
    }))
  })

  it('should render <SearchN1 />', async () => {
    render(reactQueryProviderHOC(<SearchN1 />))

    await screen.findByText('Romans et littérature')

    expect(screen).toMatchSnapshot()
  })

  describe('Search bar', () => {
    it.only('should navigate to search results with the corresponding parameters', async () => {
      const QUERY = 'Harry'
      render(reactQueryProviderHOC(<SearchN1 />))
      const searchInput = screen.getByPlaceholderText(searchN1Placeholders.LIVRES as string)
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: QUERY } })

      await act(async () => {})

      expect(navigate).toHaveBeenCalledWith(
        'TabNavigator',
        expect.objectContaining({
          screen: 'SearchStackNavigator',
          params: expect.objectContaining({
            params: expect.objectContaining({
              offerCategories: ['LIVRES'],
              query: QUERY,
            }),
          }),
        })
      )
    })
  })
})

describe('Subcategory buttons', () => {
  it('should update SearchState with correct data', async () => {
    render(reactQueryProviderHOC(<SearchN1 />))
    const subcategoryButton = await screen.findByText('Romans et littérature')
    fireEvent.press(subcategoryButton)
    await screen.findByText('Romans et littérature')

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          offerCategories: [SearchGroupNameEnumv2.LIVRES],
          offerNativeCategories: ['ROMANS_ET_LITTERATURE'],
        }),
        type: 'SET_STATE',
      })
    )
  })

  it('should navigate to search results with the corresponding parameters', async () => {
    render(reactQueryProviderHOC(<SearchN1 />))
    const subcategoryButton = await screen.findByText('Romans et littérature')

    fireEvent.press(subcategoryButton)
    await screen.findByText('Romans et littérature')

    expect(navigate).toHaveBeenCalledWith(
      'TabNavigator',
      expect.objectContaining({
        screen: 'SearchStackNavigator',
        params: expect.objectContaining({
          params: expect.objectContaining({
            offerCategories: ['LIVRES'],
            offerNativeCategories: ['ROMANS_ET_LITTERATURE'],
          }),
        }),
      })
    )
  })
})
