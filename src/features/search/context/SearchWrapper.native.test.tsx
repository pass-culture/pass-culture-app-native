import React from 'react'
import { Button, Text } from 'react-native'

import { SearchWrapper, useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import {
  checkGeolocPermission,
  GeolocPermissionState,
  LocationWrapper,
  useLocation,
} from 'libs/geolocation'
import { getPosition } from 'libs/geolocation/getPosition'
import { SuggestedPlace } from 'libs/place'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.unmock('features/search/context/SearchWrapper')

jest.unmock('libs/geolocation')

jest.mock('libs/geolocation/getPosition')
const getPositionMock = getPosition as jest.MockedFunction<typeof getPosition>

jest.mock('libs/geolocation/requestGeolocPermission')

jest.mock('libs/geolocation/checkGeolocPermission')
const mockCheckGeolocPermission = checkGeolocPermission as jest.MockedFunction<
  typeof checkGeolocPermission
>

mockCheckGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)

const mockPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('SearchWrapper', () => {
  it('should update locationType with type Place when Location Context is switched to a specified place', async () => {
    renderDummyComponent()

    await act(async () => {
      fireEvent.press(screen.getByText('SetPlace'))
    })

    expect(screen.getByText(LocationType.PLACE)).toBeOnTheScreen()
  })

  it('should update locationType with type Around me when Location Context is switched to geolocation', async () => {
    getPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderDummyComponent()

    await act(async () => {
      fireEvent.press(screen.getByText('SetPlace'))
    })

    screen.getByText(LocationType.PLACE)

    await act(async () => {
      fireEvent.press(screen.getByText('UnSetPlace'))
    })

    expect(screen.getByText(LocationType.AROUND_ME)).toBeOnTheScreen()
  })

  it('should not update locationType when searchState is set with a venue', async () => {
    getPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderDummyComponent()

    await act(async () => {
      fireEvent.press(screen.getByText('SetVenue'))
    })

    screen.getByText(LocationType.VENUE)

    await act(async () => {
      fireEvent.press(screen.getByText('SetPlace'))
    })

    expect(screen.getByText(LocationType.VENUE)).toBeOnTheScreen()
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
      <Button title="SetPlace" onPress={() => setPlace(mockPlace)} />
      <Button title="UnSetPlace" onPress={() => setPlace(null)} />
      <Button
        title="SetVenue"
        onPress={() =>
          dispatch({
            type: 'SET_LOCATION_FILTERS',
            payload: {
              locationFilter: {
                locationType: LocationType.VENUE,
                venue: {
                  _geoloc: { lat: 48.94083, lng: 2.47987 },
                  info: 'Paris',
                  label: 'La librairie quantique DATA',
                  venueId: 9384,
                },
              },
              includeDigitalOffers: false,
            },
          })
        }
      />
    </React.Fragment>
  )
}
