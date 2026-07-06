jest.mock('features/navigation/navigationRef', () => ({
  navigationRef: {
    getCurrentRoute: jest.fn(),
    isReady: jest.fn().mockReturnValue(true),
    setParams: jest.fn(),
  },
}))

import { navigationRef } from 'features/navigation/navigationRef'
import { initialSearchState } from 'features/search/context/reducer'

import { searchStore } from './search.store'

describe('searchStore', () => {
  beforeEach(() => {
    searchStore.actions.reset()
    jest.mocked(navigationRef.setParams).mockClear()
    jest.mocked(navigationRef.getCurrentRoute).mockReturnValue({
      key: 'SearchResults',
      name: 'SearchResults',
    } as unknown as ReturnType<typeof navigationRef.getCurrentRoute>)
  })

  it('should sync params with navigation ref when on SearchResults', () => {
    const params = { ...initialSearchState, query: 'cinema' }

    searchStore.actions.setParams(params)

    expect(navigationRef.setParams).toHaveBeenCalledWith(params)
  })

  it('should not sync params with navigation ref when not on SearchResults', () => {
    jest.mocked(navigationRef.getCurrentRoute).mockReturnValueOnce({
      key: 'LocationModal',
      name: 'SearchLocationModal',
    })

    searchStore.actions.setParams({ ...initialSearchState, query: 'cinema' })

    expect(navigationRef.setParams).not.toHaveBeenCalled()
  })
})
