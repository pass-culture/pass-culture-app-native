import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { PaginatedFavoritesResponse } from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { analytics } from 'libs/analytics/provider'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { ApplicationProcessingModal } from './ApplicationProcessingModal'

const hideModal = jest.fn()
const offerId = 1

jest.mock('libs/jwt/jwt')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ApplicationProcessingModal />', () => {
  it('should match previous snapshot', () => {
    render(
      reactQueryProviderHOC(
        <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile when clicking on button "Aller sur mon profil"', async () => {
    render(
      reactQueryProviderHOC(
        <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    const button = screen.getByTestId('Aller sur mon profil')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
  })

  it('should log analytics when clicking on button "Aller sur mon profil"', async () => {
    render(
      reactQueryProviderHOC(
        <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    await user.press(screen.getByTestId('Aller sur mon profil'))

    expect(analytics.logGoToProfil).toHaveBeenCalledWith({
      from: 'ApplicationProcessingModal',
      offerId,
    })
  })

  it('should close modal when clicking on button "Mettre en favori"', async () => {
    mockServer.postApi<PaginatedFavoritesResponse>(
      '/v1/me/favorites',
      paginatedFavoritesResponseSnap
    )
    render(
      reactQueryProviderHOC(
        <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    await user.press(screen.getByText('Mettre en favori'))

    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when clicking on button "Mettre en favori"', async () => {
    mockServer.postApi<PaginatedFavoritesResponse>(
      '/v1/me/favorites',
      paginatedFavoritesResponseSnap
    )
    render(
      reactQueryProviderHOC(
        <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    await user.press(screen.getByText('Mettre en favori'))

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
      from: 'ApplicationProcessingModal',
      offerId,
    })
  })
})
