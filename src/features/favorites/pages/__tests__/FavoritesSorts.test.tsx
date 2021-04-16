import React from 'react'
import Geolocation from 'react-native-geolocation-service'
import * as ReactNativePermissions from 'react-native-permissions'
import waitForExpect from 'wait-for-expect'

import { goBack } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { GeolocationWrapper } from 'libs/geolocation/GeolocationWrapper'
import { superFlushWithAct, fireEvent, render } from 'tests/utils'

import { FavoriteSortBy, FavoritesSorts } from '../FavoritesSorts'
import { FavoritesWrapper } from '../FavoritesWrapper'

jest.mock('../FavoritesWrapper', () => jest.requireActual('../FavoritesWrapper'))

describe('FavoritesSorts component', () => {
  beforeEach(() => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('granted')
    jest.spyOn(ReactNativePermissions, 'check').mockResolvedValue('granted')
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

  it('should trigger analytics=AROUND_ME when clicking on "Proximité géographique" then accepting geoloc then validating', async () => {
    const renderAPI = await renderFavoritesSort()

    fireEvent.press(renderAPI.getByText('Proximité géographique'))
    await superFlushWithAct()
    fireEvent.press(renderAPI.getByText('Valider'))

    await waitForExpect(() => {
      expect(analytics.logHasAppliedFavoritesSorting).toBeCalledWith({
        sortBy: 'AROUND_ME',
      })
    })
  })

  it('should NOT trigger analytics=AROUND_ME when clicking on "Proximité géographique" then refusing geoloc then validating', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('denied')
    jest.spyOn(ReactNativePermissions, 'check').mockResolvedValue('denied')
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
    <GeolocationWrapper>
      <FavoritesWrapper>
        <FavoritesSorts />
      </FavoritesWrapper>
    </GeolocationWrapper>
  )
  await superFlushWithAct()
  return renderAPI
}
