import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { LocationType } from 'libs/algolia'
import { useGeolocation } from 'libs/geolocation'

import { LocationChoice } from '../LocationChoice'

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
    latitude: 2,
    longitude: 40,
  })),
}))

describe('LocationChoice component', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should dispatch actions on click (position=YES, type=AROUND_ME)', () => {
    const { getByTestId } = render(<LocationChoice type={LocationType.AROUND_ME} />)
    fireEvent.press(getByTestId('locationChoice'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_TYPE',
      payload: LocationType.AROUND_ME,
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_LOCATION',
      payload: { latitude: 2, longitude: 40 },
    })
    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should not dispatch actions on click (position=NO, type=AROUND_ME)', () => {
    useGeolocationMock.mockImplementationOnce(() => null)
    const { getByTestId } = render(<LocationChoice type={LocationType.AROUND_ME} />)
    fireEvent.press(getByTestId('locationChoice'))
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should not dispatch actions on click (position=YES, type=EVERYWHERE)', () => {
    const { getByTestId } = render(<LocationChoice type={LocationType.EVERYWHERE} />)
    fireEvent.press(getByTestId('locationChoice'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_TYPE',
      payload: LocationType.EVERYWHERE,
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_LOCATION',
      payload: null,
    })
    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should not dispatch actions on click (position=NO, type=EVERYWHERE)', () => {
    useGeolocationMock.mockImplementationOnce(() => null)
    const { getByTestId } = render(<LocationChoice type={LocationType.EVERYWHERE} />)
    fireEvent.press(getByTestId('locationChoice'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_TYPE',
      payload: LocationType.EVERYWHERE,
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_LOCATION',
      payload: null,
    })
    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
