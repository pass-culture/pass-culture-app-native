import React from 'react'
import { Button, Text } from 'react-native'

import { SearchWrapper, useSearch } from 'features/search/context/SearchWrapper'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import {
  checkGeolocPermission,
  GeolocPermissionState,
  LocationWrapper,
  useLocation,
} from 'libs/location'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.unmock('features/search/context/SearchWrapper')

jest.unmock('libs/location')

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
const getGeolocPositionMock = getGeolocPosition as jest.MockedFunction<typeof getGeolocPosition>

jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')

jest.mock('libs/location/geolocation/checkGeolocPermission/checkGeolocPermission')
const mockCheckGeolocPermission = checkGeolocPermission as jest.MockedFunction<
  typeof checkGeolocPermission
>

mockCheckGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const mockPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockVenue = {
  _geoloc: { lat: 48.94083, lng: 2.47987 },
  info: 'Paris',
  label: 'La librairie quantique DATA',
  venueId: 9384,
}

describe('SearchWrapper', () => {
  it('should update locationType with type Place when Location Context is switched to a specified place', async () => {
    renderDummyComponent()

    await act(async () => {
      fireEvent.press(screen.getByText('setPlace'))
    })

    expect(screen.getByText(LocationMode.AROUND_PLACE)).toBeOnTheScreen()
  })

  it('should not update locationType with type Place when Location Context is changed and ENABLE_APP_LOCATION FF is false', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    useFeatureFlagSpy.mockReturnValueOnce(false)
    useFeatureFlagSpy.mockReturnValueOnce(false)
    useFeatureFlagSpy.mockReturnValueOnce(false)
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderDummyComponent()

    await act(async () => {
      fireEvent.press(screen.getByText('setPlace'))
    })

    expect(screen.queryByText(LocationMode.AROUND_PLACE)).not.toBeOnTheScreen()
  })

  it('should not update locationType with type geolocation when Location Context is changed (i.e from deeplink) and ENABLE_APP_LOCATION FF is false', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    useFeatureFlagSpy.mockReturnValueOnce(false)
    useFeatureFlagSpy.mockReturnValueOnce(false)
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderDummyComponent()

    await act(async () => {})

    expect(screen.queryByText(LocationMode.AROUND_ME)).not.toBeOnTheScreen()
  })

  it('should update locationType with type Around me when Location Context is switched to geolocation', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderDummyComponent()

    await act(async () => {
      fireEvent.press(screen.getByText('setPlace'))
    })

    screen.getByText(LocationMode.AROUND_PLACE)

    await act(async () => {
      fireEvent.press(screen.getByText('unSetPlace'))
    })

    expect(screen.getByText(LocationMode.AROUND_ME)).toBeOnTheScreen()
  })

  it('should not update locationType when searchState is set with a venue', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderDummyComponent()

    await act(async () => {
      fireEvent.press(screen.getByText('setVenue'))
    })

    screen.getByText(mockVenue.label)

    await act(async () => {
      fireEvent.press(screen.getByText('setPlace'))
    })

    expect(screen.getByText(mockVenue.label)).toBeOnTheScreen()
  })
})

const renderDummyComponent = () => {
  render(
    <LocationWrapper>
      <SearchWrapper>
        <DummyComponent />
      </SearchWrapper>
    </LocationWrapper>
  )
}

const DummyComponent = () => {
  const { setPlace } = useLocation()
  const { searchState, dispatch } = useSearch()

  return (
    <React.Fragment>
      <Text>{searchState.locationFilter.locationType}</Text>
      <Text>{searchState.venue?.label ?? ''}</Text>
      <Button title="setPlace" onPress={() => setPlace(mockPlace)} />
      <Button title="unSetPlace" onPress={() => setPlace(null)} />
      <Button
        title="setVenue"
        onPress={() =>
          dispatch({
            type: 'SET_VENUE',
            payload: mockVenue,
          })
        }
      />
    </React.Fragment>
  )
}
