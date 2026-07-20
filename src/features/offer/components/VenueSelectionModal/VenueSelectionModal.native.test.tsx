import React from 'react'

import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { requestGeolocPermission as requestOSGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import {
  defaultLocationState,
  locationSelectors,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { render, screen, userEvent, waitFor } from 'tests/utils'

import { VenueSelectionModal } from './VenueSelectionModal'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')
const mockRequestOSGeolocPermission = jest.mocked(requestOSGeolocPermission)

jest.mock('libs/locationV2/syncLocation')

jest.mock('features/navigation/navigationRef', () => ({
  navigationRef: { navigate: jest.fn() },
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<VenueSelectionModal />', () => {
  beforeEach(() => {
    setFeatureFlags()
    useLocationV2.setState(defaultLocationState)
  })

  const items: VenueListItem[] = [
    {
      title: 'Envie de lire',
      address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
      distance: '500 m',
      offerId: 1,
    },
    {
      title: 'Le Livre Éclaire',
      address: '75013 Paris, 56 rue de Tolbiac',
      distance: '1,5 km',
      offerId: 2,
    },
    {
      title: 'Hachette Livre',
      address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
      distance: '2,4 km',
      offerId: 3,
    },
  ]

  const nbLoadedHits = 3
  const nbHits = 40

  it('should render items', () => {
    render(
      <VenueSelectionModal
        headerMessage=""
        subTitle=""
        rightIconAccessibilityLabel=""
        validateButtonLabel=""
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={jest.fn()}
        onClosePress={jest.fn()}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        isSharingLocation={false}
        onEndReached={jest.fn()}
      />
    )

    expect(screen.getByText('Envie de lire')).toBeOnTheScreen()
    expect(screen.getByText('Le Livre Éclaire')).toBeOnTheScreen()
    expect(screen.getByText('Hachette Livre')).toBeOnTheScreen()
  })

  it('should close modal', async () => {
    const onClose = jest.fn()

    render(
      <VenueSelectionModal
        headerMessage=""
        subTitle=""
        rightIconAccessibilityLabel=""
        validateButtonLabel=""
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={jest.fn()}
        onClosePress={onClose}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        isSharingLocation={false}
        onEndReached={jest.fn()}
      />
    )

    await user.press(screen.getByTestId('Ne pas sélectionner un autre lieu'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onSubmit with no selection', async () => {
    const onSubmit = jest.fn()

    render(
      <VenueSelectionModal
        headerMessage=""
        subTitle=""
        rightIconAccessibilityLabel=""
        validateButtonLabel="Choisir ce lieu"
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={onSubmit}
        onClosePress={jest.fn()}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        isSharingLocation={false}
        onEndReached={jest.fn()}
      />
    )

    await user.press(screen.getByText('Choisir ce lieu'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should call onSubmit with item selected', async () => {
    const onSubmit = jest.fn()

    render(
      <VenueSelectionModal
        headerMessage=""
        subTitle=""
        rightIconAccessibilityLabel=""
        validateButtonLabel="Choisir ce lieu"
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={onSubmit}
        onClosePress={jest.fn()}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        isSharingLocation={false}
        onEndReached={jest.fn()}
      />
    )

    await user.press(screen.getByText('Hachette Livre'))
    await user.press(screen.getByText('Choisir ce lieu'))

    expect(onSubmit).toHaveBeenNthCalledWith(1, 3)
  })

  describe('When user share his position', () => {
    it('should not display "Active ta géolocalisation" button', () => {
      render(
        <VenueSelectionModal
          headerMessage=""
          subTitle=""
          rightIconAccessibilityLabel=""
          validateButtonLabel=""
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation
          onEndReached={jest.fn()}
        />
      )

      expect(screen.queryByText('Active ta géolocalisation')).not.toBeOnTheScreen()
    })
  })

  describe("When user doesn't share his position", () => {
    it('should display "Active ta géolocalisation" button', () => {
      render(
        <VenueSelectionModal
          headerMessage=""
          subTitle=""
          rightIconAccessibilityLabel=""
          validateButtonLabel=""
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation={false}
          onEndReached={jest.fn()}
        />
      )

      expect(screen.getByText('Active ta géolocalisation')).toBeOnTheScreen()
    })

    it('should navigate to "Paramètres de localisation" modal when pressing "Active ta géolocalisation" button and permission is never ask again', async () => {
      mockRequestOSGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.NEVER_ASK_AGAIN)

      render(
        <VenueSelectionModal
          headerMessage=""
          subTitle=""
          rightIconAccessibilityLabel=""
          validateButtonLabel=""
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation={false}
          onEndReached={jest.fn()}
        />
      )
      const button = screen.getByText('Active ta géolocalisation')

      await user.press(button)

      const { navigationRef } = jest.requireMock('features/navigation/navigationRef') as {
        navigationRef: { navigate: jest.Mock }
      }
      await waitFor(() =>
        expect(navigationRef.navigate).toHaveBeenCalledWith('GeolocationActivationModal')
      )
    })
  })

  describe('When user has forbidden his position', () => {
    it('should ask for permission when pressing "Active ta géolocalisation" button and permission is denied', async () => {
      mockRequestOSGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

      render(
        <VenueSelectionModal
          headerMessage=""
          subTitle=""
          rightIconAccessibilityLabel=""
          validateButtonLabel=""
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation={false}
          onEndReached={jest.fn()}
        />
      )
      const button = screen.getByText('Active ta géolocalisation')

      await user.press(button)

      await waitFor(() =>
        expect(locationSelectors.selectPermissionState()).toBe(GeolocPermissionState.DENIED)
      )
    })
  })
})
