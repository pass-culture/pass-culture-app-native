import React from 'react'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { FavoriteSortBy } from 'features/favorites/types'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import {
  GeolocPositionError,
  GeolocPermissionState,
  GeolocationError,
  GeoCoordinates,
  GEOLOCATION_USER_ERROR_MESSAGE,
} from 'libs/location'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates | null
const mockPositionError = null as GeolocationError | null
const defaultUseLocation = {
  permissionState: GeolocPermissionState.GRANTED,
  geolocPosition: DEFAULT_POSITION,
  geolocPositionError: mockPositionError,
  triggerPositionUpdate: jest.fn(),
  showGeolocPermissionModal: jest.fn(),
  requestGeolocPermission: jest.fn(),
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<FavoritesSorts/>', () => {
  it('should render correctly', () => {
    mockUseLocation.mockReturnValueOnce(defaultUseLocation)
    renderFavoritesSort()

    expect(screen).toMatchSnapshot()
  })

  it('should go back on validate', async () => {
    mockUseLocation.mockReturnValueOnce(defaultUseLocation)
    renderFavoritesSort()

    fireEvent.press(screen.getByText('Valider'))

    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })

  it.each`
    sortByWording         | expectedAnalytics
    ${'Ajouté récemment'} | ${'RECENTLY_ADDED'}
    ${'Prix croissant'}   | ${'ASCENDING_PRICE'}
  `(
    'should trigger analytics=$expectedAnalytics when clicking on "$sortByWording" then validating',
    async ({
      sortByWording,
      expectedAnalytics,
    }: {
      sortByWording: string
      expectedAnalytics: FavoriteSortBy
    }) => {
      mockUseLocation.mockReturnValueOnce(defaultUseLocation)
      renderFavoritesSort()

      fireEvent.press(screen.getByText(sortByWording))
      fireEvent.press(screen.getByText('Valider'))

      await waitFor(() => {
        expect(analytics.logHasAppliedFavoritesSorting).toHaveBeenCalledWith({
          sortBy: expectedAnalytics,
        })
      })
    }
  )

  it('should display error message when clicking on "Proximité géographique" and position is unavailable', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...defaultUseLocation,
      geolocPosition: null,
      geolocPositionError: {
        type: GeolocPositionError.SETTINGS_NOT_SATISFIED,
        message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED],
      },
    })

    renderFavoritesSort()

    fireEvent.press(screen.getByText('Proximité géographique'))

    expect(
      screen.getByText(GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED])
    ).toBeOnTheScreen()
  })

  it('should trigger analytics=AROUND_ME when clicking on "Proximité géographique" then accepting geoloc then validating', async () => {
    mockUseLocation.mockReturnValueOnce(defaultUseLocation)
    renderFavoritesSort()

    fireEvent.press(screen.getByText('Proximité géographique'))
    fireEvent.press(screen.getByText('Valider'))

    await waitFor(() => {
      expect(
        screen.queryByText(`La géolocalisation est temporairement inutilisable sur ton téléphone`)
      ).not.toBeOnTheScreen()
      expect(analytics.logHasAppliedFavoritesSorting).toHaveBeenCalledWith({
        sortBy: 'AROUND_ME',
      })
    })
  })

  it('should NOT trigger analytics=AROUND_ME when clicking on "Proximité géographique" then refusing geoloc then validating', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...defaultUseLocation,
      geolocPosition: null,
      permissionState: GeolocPermissionState.DENIED,
    })

    renderFavoritesSort()

    fireEvent.press(screen.getByText('Proximité géographique'))
    fireEvent.press(screen.getByText('Valider'))

    await waitFor(() => {
      expect(analytics.logHasAppliedFavoritesSorting).toHaveBeenCalledWith({
        sortBy: 'RECENTLY_ADDED',
      })
      expect(analytics.logHasAppliedFavoritesSorting).not.toHaveBeenCalledWith({
        sortBy: 'AROUND_ME',
      })
    })
  })
})

function renderFavoritesSort() {
  render(
    <FavoritesWrapper>
      <FavoritesSorts />
    </FavoritesWrapper>
  )
}
