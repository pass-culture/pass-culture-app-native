import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { initialSearchState } from 'features/search/context/reducer'
import { doAlgoliaRedirect } from 'libs/algolia/doAlgoliaRedirect'

const mockSearchstate = { ...initialSearchState, shouldRedirect: true }
const mockDispatch = jest.fn()
const mockNavigateToThematicSearch = navigate

describe('doAlgoliaRedirect', () => {
  it('should redirect to thematicSearch', async () => {
    const mockUrl =
      'http://passculture.app/recherche/resultats?offerCategories=%5B%22CINEMA%22%5D&query=%22%22'

    doAlgoliaRedirect(
      new URL(mockUrl),
      mockSearchstate,
      defaultDisabilitiesProperties,
      mockDispatch,
      mockNavigateToThematicSearch
    )

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
  })
})
