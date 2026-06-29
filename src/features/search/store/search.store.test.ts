jest.mock('features/navigation/navigationRef', () => ({
  navigationRef: { setParams: jest.fn() },
}))

import { navigationRef } from 'features/navigation/navigationRef'
import { initialSearchState } from 'features/search/context/reducer'

import { searchStore } from './search.store'

describe('searchStore', () => {
  beforeEach(() => {
    searchStore.actions.reset()
    jest.mocked(navigationRef.setParams).mockClear()
  })

  it('should sync params with navigation ref', () => {
    const params = { ...initialSearchState, query: 'cinema' }

    searchStore.actions.setParams(params)

    expect(navigationRef.setParams).toHaveBeenCalledWith(params)
  })
})
