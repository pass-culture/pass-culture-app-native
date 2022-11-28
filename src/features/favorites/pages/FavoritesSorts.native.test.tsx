import React from 'react'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { FavoriteSortBy } from 'features/favorites/types'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { analytics } from 'libs/firebase/analytics'
import {
  GeolocPositionError,
  GeolocPermissionState,
  GeolocationError,
  GeoCoordinates,
  GEOLOCATION_USER_ERROR_MESSAGE,
} from 'libs/geolocation'
import { fireEvent, render, waitFor } from 'tests/utils'

jest.mock('features/favorites/context/FavoritesWrapper', () =>
  jest.requireActual('features/favorites/context/FavoritesWrapper')
)

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates
let mockPermissionState = GeolocPermissionState.GRANTED
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
let mockPositionError: GeolocationError | null = null
const mockTriggerPositionUpdate = jest.fn()
const mockShowGeolocPermissionModal = jest.fn()
const mockRequestGeolocPermission = jest.fn()

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    position: mockPosition,
    positionError: mockPositionError,
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
    const renderAPI = renderFavoritesSort()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should go back on validate', async () => {
    const renderAPI = renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Valider'))

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
      const renderAPI = renderFavoritesSort()

      fireEvent.press(renderAPI.getByText(sortByWording))
      fireEvent.press(renderAPI.getByText('Valider'))

      await waitFor(() => {
        expect(analytics.logHasAppliedFavoritesSorting).toBeCalledWith({
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
    const renderAPI = renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Proximité géographique'))

    renderAPI.getByText(mockPositionError.message)
  })

  it('should trigger analytics=AROUND_ME when clicking on "Proximité géographique" then accepting geoloc then validating', async () => {
    const renderAPI = renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Proximité géographique'))
    fireEvent.press(renderAPI.getByText('Valider'))

    await waitFor(() => {
      expect(
        renderAPI.queryByText(
          `La géolocalisation est temporairement inutilisable sur ton téléphone`
        )
      ).toBeFalsy()
      expect(analytics.logHasAppliedFavoritesSorting).toBeCalledWith({
        sortBy: 'AROUND_ME',
      })
    })
  })

  it('should NOT trigger analytics=AROUND_ME when clicking on "Proximité géographique" then refusing geoloc then validating', async () => {
    mockPosition = null
    mockPermissionState = GeolocPermissionState.DENIED
    const renderAPI = renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Proximité géographique'))
    fireEvent.press(renderAPI.getByText('Valider'))

    await waitFor(() => {
      expect(analytics.logHasAppliedFavoritesSorting).toBeCalledWith({
        sortBy: 'RECENTLY_ADDED',
      })
      expect(analytics.logHasAppliedFavoritesSorting).not.toBeCalledWith({
        sortBy: 'AROUND_ME',
      })
    })
  })
})

function renderFavoritesSort() {
  const renderAPI = render(
    <FavoritesWrapper>
      <FavoritesSorts />
    </FavoritesWrapper>
  )
  return renderAPI
}
