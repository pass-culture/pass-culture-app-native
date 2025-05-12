import { mockLocationState } from 'features/location/fixtures/mockLocationState'
import { mockPlaces } from 'features/location/fixtures/mockPlaces'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'

import { getLocationSubmit } from './getLocationSubmit'

const mockProps = {
  ...mockLocationState,
  dismissModal: jest.fn(),
  from: 'search',
  dispatch: jest.fn(),
  selectedPlace: mockPlaces[0],
} as const

describe('getLocationSubmit', () => {
  it('should call dismissModal on onClose', () => {
    const result = getLocationSubmit(mockProps)

    result.onClose()

    expect(mockProps.dismissModal).toHaveBeenCalledTimes(1)
  })

  describe('When on onSubmit with location mode is AROUND_PLACE', () => {
    it('should call setSelectedLocationMode with AROUND_PLACE', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_PLACE)

      expect(mockProps.setSelectedLocationMode).toHaveBeenNthCalledWith(
        1,
        LocationMode.AROUND_PLACE
      )
    })

    it('should call setPlaceGlobally with the selected place', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_PLACE)

      expect(mockProps.setPlaceGlobally).toHaveBeenNthCalledWith(1, mockPlaces[0])
    })

    it('should call setTempAroundMeRadius with the default radius', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_PLACE)

      expect(mockProps.setTempAroundMeRadius).toHaveBeenNthCalledWith(1, DEFAULT_RADIUS)
    })

    it('should call dispatch with SET_LOCATION_PLACE with the selected place when dispatch defined', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_PLACE)

      expect(mockProps.dispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_LOCATION_PLACE',
        payload: {
          place: mockPlaces[0],
          aroundRadius: DEFAULT_RADIUS,
        },
      })
    })

    it('should not call dispatch with SET_LOCATION_PLACE with the selected place when dispatch not defined', () => {
      const result = getLocationSubmit({ ...mockProps, dispatch: undefined })

      result.onSubmit(LocationMode.AROUND_PLACE)

      expect(mockProps.dispatch).not.toHaveBeenCalled()
    })

    it('should call logUserSetLocation', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_PLACE)

      expect(analytics.logUserSetLocation).toHaveBeenNthCalledWith(1, 'search')
    })
  })

  describe('When on onSubmit with location mode is AROUND_ME', () => {
    it('should call setPlaceGlobally with null', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_ME)

      expect(mockProps.setPlaceGlobally).toHaveBeenNthCalledWith(1, null)
    })

    it('should call setAroundMeRadius with the selected radius', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_ME)

      expect(mockProps.setAroundMeRadius).toHaveBeenNthCalledWith(1, DEFAULT_RADIUS)
    })

    it('should call setTempAroundPlaceRadius with the default radius', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_ME)

      expect(mockProps.setTempAroundPlaceRadius).toHaveBeenNthCalledWith(1, DEFAULT_RADIUS)
    })

    it('should call dispatch with SET_LOCATION_AROUND_ME with the selected radius when dispatch defined', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.AROUND_ME)

      expect(mockProps.dispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_LOCATION_AROUND_ME',
        payload: DEFAULT_RADIUS,
      })
    })

    it('should not call dispatch with SET_LOCATION_AROUND_ME with the selected radius when dispatch not defined', () => {
      const result = getLocationSubmit({ ...mockProps, dispatch: undefined })

      result.onSubmit(LocationMode.AROUND_ME)

      expect(mockProps.dispatch).not.toHaveBeenCalled()
    })
  })

  describe('When on onSubmit with location mode is EVERYWHERE', () => {
    it('should call setPlaceGlobally with null', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.EVERYWHERE)

      expect(mockProps.setPlaceGlobally).toHaveBeenNthCalledWith(1, null)
    })

    it('should call dispatch with SET_LOCATION_EVERYWHERE  when dispatch defined', () => {
      const result = getLocationSubmit(mockProps)

      result.onSubmit(LocationMode.EVERYWHERE)

      expect(mockProps.dispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_LOCATION_EVERYWHERE',
      })
    })

    it('should not call dispatch with SET_LOCATION_EVERYWHERE  when dispatch not defined', () => {
      const result = getLocationSubmit({ ...mockProps, dispatch: undefined })

      result.onSubmit(LocationMode.EVERYWHERE)

      expect(mockProps.dispatch).not.toHaveBeenCalled()
    })
  })
})
