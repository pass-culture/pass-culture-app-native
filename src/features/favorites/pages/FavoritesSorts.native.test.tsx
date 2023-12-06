import React from 'react'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { FavoriteSortBy } from 'features/favorites/types'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { analytics } from 'libs/analytics'
import {
  GeolocPositionError,
  GeolocPermissionState,
  GeolocationError,
  GeoCoordinates,
  GEOLOCATION_USER_ERROR_MESSAGE,
  Position,
} from 'libs/location'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

jest.mock('features/favorites/context/FavoritesWrapper', () =>
  jest.requireActual('features/favorites/context/FavoritesWrapper')
)

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates
let mockPermissionState = GeolocPermissionState.GRANTED
let mockPosition: Position = DEFAULT_POSITION
let mockPositionError: GeolocationError | null = null
const mockTriggerPositionUpdate = jest.fn()
const mockShowGeolocPermissionModal = jest.fn()
const mockRequestGeolocPermission = jest.fn()

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    permissionState: mockPermissionState,
    userPosition: mockPosition,
    userPositionError: mockPositionError,
    triggerPositionUpdate: mockTriggerPositionUpdate,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
    requestGeolocPermission: mockRequestGeolocPermission,
  }),
}))

describe('<FavoritesSorts/>', () => {
  beforeEach(() => {
    mockPermissionState = GeolocPermissionState.GRANTED
    mockPosition = DEFAULT_POSITION
    mockPositionError = null
  })

  afterEach(jest.resetAllMocks)

  it('should render correctly', () => {
    renderFavoritesSort()

    expect(screen).toMatchSnapshot()
  })

  it('should go back on validate', async () => {
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
    mockPosition = null
    mockPositionError = {
      type: GeolocPositionError.SETTINGS_NOT_SATISFIED,
      message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED],
    }
    renderFavoritesSort()

    fireEvent.press(screen.getByText('Proximité géographique'))

    expect(screen.queryByText(mockPositionError.message)).toBeOnTheScreen()
  })

  it('should trigger analytics=AROUND_ME when clicking on "Proximité géographique" then accepting geoloc then validating', async () => {
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
    mockPosition = null
    mockPermissionState = GeolocPermissionState.DENIED
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
