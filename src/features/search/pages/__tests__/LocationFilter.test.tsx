import React from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { initialSearchState } from 'features/search/pages/reducer'
import { env } from 'libs/environment'
import { GeolocPermissionState } from 'libs/geolocation'
import { fireEvent, render } from 'tests/utils'

import { LocationFilter } from '../LocationFilter'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
let mockPermissionState = GeolocPermissionState.GRANTED
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    position: mockPosition,
  }),
}))

describe('LocationFilter component', () => {
  beforeEach(jest.clearAllMocks)
  afterEach(() => {
    mockPermissionState = GeolocPermissionState.GRANTED
    mockPosition = DEFAULT_POSITION
  })

  it('should render correctly', () => {
    const { toJSON } = render(<LocationFilter />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display error message when (position=null, type=AROUND_ME)', async () => {
    mockPosition = null
    const { getByText, getByTestId } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-aroundMe'))
    getByText(
      `Nous n'arrivons pas à récuperer ta position, si le problème persiste tu peux contacter ${env.SUPPORT_EMAIL_ADDRESS}`
    )
    expect(mockDispatch).not.toBeCalled()
  })

  it('should dispatch actions on click (position=YES, type=AROUND_ME)', () => {
    const { getByTestId, queryByText } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-aroundMe'))
    expect(
      queryByText(
        `Nous n'arrivons pas à récuperer ta position, si le problème persiste tu peux contacter ${env.SUPPORT_EMAIL_ADDRESS}`
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_AROUND_ME',
      payload: DEFAULT_POSITION,
    })
  })

  it('should not dispatch actions on click (position=NO, type=AROUND_ME)', () => {
    mockPosition = null
    const { getByTestId } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-aroundMe'))
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should dispatch actions on click (position=YES, type=EVERYWHERE)', () => {
    const { getByTestId } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-everywhere'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOCATION_EVERYWHERE' })
  })

  it('should dispatch actions on click (position=NO, type=EVERYWHERE)', () => {
    const { getByTestId } = render(<LocationFilter />)
    fireEvent.press(getByTestId('locationChoice-everywhere'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOCATION_EVERYWHERE' })
  })
})
