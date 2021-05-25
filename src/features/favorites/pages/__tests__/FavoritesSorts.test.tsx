import React from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'
import waitForExpect from 'wait-for-expect'

import { goBack } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState } from 'libs/geolocation'
import { superFlushWithAct, fireEvent, render } from 'tests/utils'

import { FavoriteSortBy, FavoritesSorts } from '../FavoritesSorts'
import { FavoritesWrapper } from '../FavoritesWrapper'

jest.mock('../FavoritesWrapper', () => jest.requireActual('../FavoritesWrapper'))

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates
let mockPermissionState = GeolocPermissionState.GRANTED
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
let mockIsPositionUnavailable = false
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    position: mockPosition,
    isPositionUnavailable: mockIsPositionUnavailable,
  }),
}))

describe('FavoritesSorts component', () => {
  beforeEach(() => {
    mockPermissionState = GeolocPermissionState.GRANTED
    mockPosition = DEFAULT_POSITION
    mockIsPositionUnavailable = false
  })
  afterEach(jest.resetAllMocks)

  it('should render correctly', async () => {
    const renderAPI = await renderFavoritesSort()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should go back on validate', async () => {
    const renderAPI = await renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Valider'))

    await waitForExpect(() => {
      expect(goBack).toBeCalled()
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
      const renderAPI = await renderFavoritesSort()

      fireEvent.press(renderAPI.getByText(sortByWording))
      fireEvent.press(renderAPI.getByText('Valider'))

      await waitForExpect(() => {
        expect(analytics.logHasAppliedFavoritesSorting).toBeCalledWith({
          sortBy: expectedAnalytics,
        })
      })
    }
  )

  it('should display error message when clicking on "Proximité géographique" and position is unavailable', async () => {
    mockIsPositionUnavailable = true
    mockPosition = null
    const renderAPI = await renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Proximité géographique'))

    await waitForExpect(() => {
      renderAPI.getByText(`La géolocalisation est temporairement inutilisable sur ton téléphone`)
    })
  })

  it('should trigger analytics=AROUND_ME when clicking on "Proximité géographique" then accepting geoloc then validating', async () => {
    const renderAPI = await renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Proximité géographique'))
    await superFlushWithAct()
    fireEvent.press(renderAPI.getByText('Valider'))

    await waitForExpect(() => {
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
    const renderAPI = await renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Proximité géographique'))
    await superFlushWithAct()
    fireEvent.press(renderAPI.getByText('Valider'))

    await waitForExpect(() => {
      expect(analytics.logHasAppliedFavoritesSorting).toBeCalledWith({
        sortBy: 'RECENTLY_ADDED',
      })
      expect(analytics.logHasAppliedFavoritesSorting).not.toBeCalledWith({
        sortBy: 'AROUND_ME',
      })
    })
  })
})

async function renderFavoritesSort() {
  const renderAPI = render(
    <FavoritesWrapper>
      <FavoritesSorts />
    </FavoritesWrapper>
  )
  await superFlushWithAct()
  return renderAPI
}
