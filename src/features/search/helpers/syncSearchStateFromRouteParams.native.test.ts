import { initialSearchState } from 'features/search/context/reducer'

import { syncSearchStateFromRouteParams } from './syncSearchStateFromRouteParams'

describe('syncSearchStateFromRouteParams', () => {
  const dispatch = jest.fn()

  beforeEach(() => {
    dispatch.mockClear()
  })

  it('should do nothing when params are undefined', () => {
    syncSearchStateFromRouteParams(undefined, dispatch)

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should dispatch search state from route params', () => {
    const params = {
      query: 'cinema',
      venue: {
        label: 'VESOUL MUSIQUE',
        info: 'Vesoul',
        venueId: 25761,
        activity: null,
        isOpenToPublic: true,
      },
    }

    syncSearchStateFromRouteParams(params, dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: { ...initialSearchState, ...params },
    })
  })

  it('should omit accessibilityFilter from search state', () => {
    syncSearchStateFromRouteParams(
      {
        query: 'theatre',
        accessibilityFilter: { isAudioDisabilityCompliant: true },
      },
      dispatch
    )

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: { ...initialSearchState, query: 'theatre' },
    })
  })
})
