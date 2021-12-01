import React from 'react'

import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import {
  GeolocPositionError,
  GeolocPermissionState,
  GeolocationError,
  GeoCoordinates,
  GEOLOCATION_USER_ERROR_MESSAGE,
} from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
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
let mockPositionError: GeolocationError | null = null
const mockTriggerPositionUpdate = jest.fn()
const mockShowGeolocPermissionModal = jest.fn()

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    position: mockPosition,
    positionError: mockPositionError,
    triggerPositionUpdate: mockTriggerPositionUpdate,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

describe('LocationFilter component', () => {
  afterEach(() => {
    mockPermissionState = GeolocPermissionState.GRANTED
    mockPosition = DEFAULT_POSITION
    mockPositionError = null
  })

  it('should render correctly', () => {
    const { toJSON } = renderLocationFilter()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display error message when (position=null, type=AROUND_ME)', async () => {
    mockPosition = null
    mockPositionError = {
      type: GeolocPositionError.SETTINGS_NOT_SATISFIED,
      message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED],
    }
    const { getByText, getByTestId } = renderLocationFilter()
    fireEvent.press(getByTestId('locationChoice-aroundMe'))
    getByText(mockPositionError.message)
    expect(mockDispatch).not.toBeCalled()
  })

  it('should dispatch actions on click (position=YES, type=AROUND_ME)', () => {
    const { getByTestId, queryByText } = renderLocationFilter()
    fireEvent.press(getByTestId('locationChoice-aroundMe'))
    expect(
      queryByText(`La géolocalisation est temporairement inutilisable sur ton téléphone`)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_LOCATION_AROUND_ME' })
  })

  it('should not dispatch actions on click (position=NO, type=AROUND_ME)', () => {
    mockPosition = null
    const { getByTestId } = renderLocationFilter()
    fireEvent.press(getByTestId('locationChoice-aroundMe'))
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should dispatch actions on click (position=YES, type=EVERYWHERE)', () => {
    const { getByTestId } = renderLocationFilter()
    fireEvent.press(getByTestId('locationChoice-everywhere'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_LOCATION_EVERYWHERE' })
  })

  it('should dispatch actions on click (position=NO, type=EVERYWHERE)', () => {
    const { getByTestId } = renderLocationFilter()
    fireEvent.press(getByTestId('locationChoice-everywhere'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_LOCATION_EVERYWHERE' })
  })

  it('should show the building icon when a venue is chosen', () => {
    mockSearchState.locationFilter = {
      locationType: LocationType.VENUE,
      venue: { ...Kourou, venueId: 4 },
    }
    const { queryByTestId } = renderLocationFilter()

    expect(queryByTestId('BicolorLocationBuilding')).toBeTruthy()
    expect(queryByTestId('BicolorLocationPointer')).toBeFalsy()
  })

  it('should show the pointer icon if a location is chosen', () => {
    mockSearchState.locationFilter = {
      locationType: LocationType.PLACE,
      aroundRadius: 10,
      place: Kourou,
    }
    const { queryByTestId } = renderLocationFilter()
    expect(queryByTestId('BicolorLocationBuilding')).toBeFalsy()
    expect(queryByTestId('BicolorLocationPointer')).toBeTruthy()
  })
})

function renderLocationFilter() {
  return render(<LocationFilter />)
}
