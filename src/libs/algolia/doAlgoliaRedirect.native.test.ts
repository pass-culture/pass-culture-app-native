import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import { doAlgoliaRedirect } from 'libs/algolia/doAlgoliaRedirect'

const mockSearchstate = { ...initialSearchState, shouldRedirect: true }
const mockDispatch = jest.fn()
const mockNavigateToThematicSearch = navigate

describe('doAlgoliaRedirect', () => {
  it('should redirect to thematicSearch', async () => {
    executeDoAlgoliaRedirect(mockSearchstate)

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: expect.objectContaining({
        shouldRedirect: false,
      }),
    })

    expect(mockNavigateToThematicSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldRedirect: false,
        offerCategories: [SearchGroupNameEnumv2.CINEMA],
      }),
      defaultDisabilitiesProperties
    )

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: expect.objectContaining({
        query: '',
      }),
    })
  })

  it('should reset query after redirection to thematicSearch', async () => {
    const mockQuery = 'cinema'
    executeDoAlgoliaRedirect({ ...mockSearchstate, query: mockQuery })

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: expect.objectContaining({
        shouldRedirect: false,
        query: mockQuery,
      }),
    })

    expect(mockNavigateToThematicSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldRedirect: false,
        offerCategories: [SearchGroupNameEnumv2.CINEMA],
        query: mockQuery,
      }),
      defaultDisabilitiesProperties
    )

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: expect.objectContaining({
        query: '',
      }),
    })
  })
})

const executeDoAlgoliaRedirect = (searchState: SearchState) => {
  const mockUrl =
    'http://passculture.app/recherche/resultats?offerCategories=%5B%22CINEMA%22%5D&query=%22%22'

  doAlgoliaRedirect(
    new URL(mockUrl),
    searchState,
    defaultDisabilitiesProperties,
    mockDispatch,
    mockNavigateToThematicSearch
  )
}
