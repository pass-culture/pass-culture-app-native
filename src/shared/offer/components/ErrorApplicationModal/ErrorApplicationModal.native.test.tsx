import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { analytics } from 'libs/analytics/provider'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/jwt/jwt')

const hideModal = jest.fn()
const offerId = 1

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ErrorApplicationModal />', () => {
  it('should match previous snapshot', () => {
    renderErrorApplicationModal()

    expect(screen).toMatchSnapshot()
  })

  it('should close modal and navigate to profile when pressing "Aller vers la section profil" button', async () => {
    renderErrorApplicationModal()

    await user.press(screen.getByLabelText('Aller vers la section profil'))

    expect(hideModal).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
  })

  it('should log analytics when clicking on close button with label "Aller vers la section profil', async () => {
    renderErrorApplicationModal()

    await user.press(screen.getByLabelText('Aller vers la section profil'))

    expect(analytics.logGoToProfil).toHaveBeenNthCalledWith(1, {
      from: 'ErrorApplicationModal',
      offerId,
    })
  })

  it('should close modal when clicking on button "Mettre en favori', async () => {
    mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)
    renderErrorApplicationModal()

    await user.press(screen.getByText('Mettre en favori'))

    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when clicking on button "Mettre en favori', async () => {
    mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)
    renderErrorApplicationModal()

    await user.press(screen.getByText('Mettre en favori'))

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
      from: 'ErrorApplicationModal',
      offerId,
    })
  })
})

const renderErrorApplicationModal = () => {
  render(
    reactQueryProviderHOC(<ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />)
  )
}
