import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { LocationType } from 'libs/algolia'
import { useGeolocation } from 'libs/geolocation'

import { LocationFilter } from '../LocationFilter'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
const useGeolocationMock = useGeolocation as jest.Mock

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({
    position: {
      latitude: 2,
      longitude: 40,
    },
  })),
  useRequestGeolocPermission: jest.fn(() => ({
    requestPermissionRoutine: jest.fn(),
  })),
}))

describe('LocationFilter component', () => {
  beforeEach(() => jest.clearAllMocks())
  it('should render correctly', () => {
    const { toJSON } = render(<LocationFilter />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should dispatch actions on click (position=YES, type=AROUND_ME)', () => {
    const { getByTestId } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-aroundMe'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_TYPE',
      payload: LocationType.AROUND_ME,
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_POSITION',
      payload: { latitude: 2, longitude: 40 },
    })
  })

  it('should not dispatch actions on click (position=NO, type=AROUND_ME)', () => {
    useGeolocationMock.mockImplementationOnce(() => ({ position: null }))
    const { getByTestId } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-aroundMe'))
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should dispatch actions on click (position=YES, type=EVERYWHERE)', () => {
    const { getByTestId } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-everywhere'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_TYPE',
      payload: LocationType.EVERYWHERE,
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_POSITION',
      payload: null,
    })
  })

  it('should dispatch actions on click (position=NO, type=EVERYWHERE)', () => {
    useGeolocationMock.mockImplementationOnce(() => ({ position: null }))
    const { getByTestId } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-everywhere'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_TYPE',
      payload: LocationType.EVERYWHERE,
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_POSITION',
      payload: null,
    })
  })
})
