import React from 'react'
import { Button, Text } from 'react-native'

import { SearchWrapper, useSearch } from 'features/search/context/SearchWrapper'
import {
  checkGeolocPermission,
  GeolocPermissionState,
  LocationWrapper,
  useLocation,
} from 'libs/location/location'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { userEvent, render, screen } from 'tests/utils'

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
const getGeolocPositionMock = getGeolocPosition as jest.MockedFunction<typeof getGeolocPosition>

jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')

jest.mock('libs/location/geolocation/checkGeolocPermission/checkGeolocPermission')
const mockCheckGeolocPermission = checkGeolocPermission as jest.MockedFunction<
  typeof checkGeolocPermission
>

mockCheckGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)

const mockPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const user = userEvent.setup()
jest.useFakeTimers()

describe('SearchWrapper', () => {
  it('should update locationType with type Around Place when Location Context is switched to a specified place', async () => {
    renderDummyComponent()

    await user.press(screen.getByText('setLocationModeAroundPlace'))

    expect(screen.getByText(LocationMode.AROUND_PLACE)).toBeOnTheScreen()
  })

  it('should update locationType with type Around me when Location Context is switched to geolocation', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderDummyComponent()

    await user.press(screen.getByText('setLocationModeAroundPlace'))

    screen.getByText(LocationMode.AROUND_PLACE)

    await user.press(screen.getByText('setLocationModeAroundMe'))

    expect(screen.getByText(LocationMode.AROUND_ME)).toBeOnTheScreen()
  })

  it(`should update locationType with type Everywhere when Location Context is switched to ${LocationLabel.everywhereLabel}`, async () => {
    renderDummyComponent()

    await user.press(screen.getByText('setLocationModeAroundPlace'))

    screen.getByText(LocationMode.AROUND_PLACE)

    await user.press(screen.getByText('setLocationModeEverywhere'))

    expect(screen.getByText(LocationMode.EVERYWHERE)).toBeOnTheScreen()
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
  const { setPlace, setSelectedLocationMode } = useLocation()
  const { searchState } = useSearch()

  const setLocationModeAroundPlace = () => {
    setPlace(mockPlace)
    setSelectedLocationMode(LocationMode.AROUND_PLACE)
  }
  return (
    <React.Fragment>
      <Text>{searchState.locationFilter.locationType}</Text>
      <Text>{searchState.venue?.label ?? ''}</Text>
      <Button title="setLocationModeAroundPlace" onPress={setLocationModeAroundPlace} />
      <Button
        title="setLocationModeEverywhere"
        onPress={() => setSelectedLocationMode(LocationMode.EVERYWHERE)}
      />
      <Button
        title="setLocationModeAroundMe"
        onPress={() => setSelectedLocationMode(LocationMode.AROUND_ME)}
      />
    </React.Fragment>
  )
}
