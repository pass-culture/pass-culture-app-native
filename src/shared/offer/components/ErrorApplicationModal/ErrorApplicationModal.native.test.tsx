import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { analytics } from 'libs/analytics'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')

const hideModal = jest.fn()
const offerId = 1

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<ErrorApplicationModal />', () => {
  it('should match previous snapshot', () => {
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    expect(screen).toMatchSnapshot()
  })

  it('should close modal and navigate to profile when pressing "Aller vers la section profil" button', () => {
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    fireEvent.press(screen.getByLabelText('Aller vers la section profil'))

    expect(hideModal).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
  })

  it('should log analytics when clicking on close button with label "Aller vers la section profil', async () => {
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    fireEvent.press(screen.getByLabelText('Aller vers la section profil'))

    expect(analytics.logGoToProfil).toHaveBeenNthCalledWith(1, {
      from: 'ErrorApplicationModal',
      offerId,
    })
  })

  it('should close modal when clicking on button "Mettre en favori', async () => {
    mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    fireEvent.press(screen.getByText('Mettre en favori'))

    await waitFor(() => {
      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should log analytics when clicking on button "Mettre en favori', async () => {
    mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    fireEvent.press(screen.getByText('Mettre en favori'))

    await waitFor(() => {
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
        from: 'ErrorApplicationModal',
        offerId,
      })
    })
  })
})
