import React from 'react'

import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, GeolocPermissionState } from 'libs/location'
import { fireEvent, render, screen } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

import { VenueSelectionModal } from './VenueSelectionModal'

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates | null
const mockRequestGeolocPermission = jest.fn()
const defaultUseLocation = {
  geolocPosition: DEFAULT_POSITION,
  permissionState: GeolocPermissionState.GRANTED,
  onPressGeolocPermissionModalButton: jest.fn(),
  requestGeolocPermission: mockRequestGeolocPermission,
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

describe('<VenueSelectionModal />', () => {
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

    expect(screen.queryAllByTestId('venue-selection-list-item')).toHaveLength(3)
  })

  it('should close modal', () => {
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

    fireEvent.press(screen.getByTestId('Ne pas sélectionner un autre lieu'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onSubmit with no selection', () => {
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

    fireEvent.press(screen.getByText('Choisir ce lieu'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should call onSubmit with item selected', () => {
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

    fireEvent.press(screen.getByText('Hachette Livre'))
    fireEvent.press(screen.getByText('Choisir ce lieu'))

    expect(onSubmit).toHaveBeenNthCalledWith(1, 3)
  })

  describe('When user share his position', () => {
    beforeAll(() => {
      mockUseLocation.mockReturnValue({
        ...defaultUseLocation,
        geolocPosition: DEFAULT_POSITION,
        permissionState: GeolocPermissionState.GRANTED,
      })
    })

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
    beforeAll(() => {
      mockUseLocation.mockReturnValue({
        ...defaultUseLocation,
        geolocPosition: null,
        permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
      })
    })

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

    it('should open "Paramètres de localisation" modal when pressing "Active ta géolocalisation" button and permission is never ask again', () => {
      const mockShowModal = jest.fn()
      jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
        visible: false,
        showModal: mockShowModal,
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })

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

      fireEvent.press(button)

      expect(mockShowModal).toHaveBeenCalledWith()
    })

    it('should close geolocation modal when pressing "Activer la géolocalisation"', async () => {
      const mockHideModal = jest.fn()
      jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
        visible: true,
        showModal: jest.fn(),
        hideModal: mockHideModal,
        toggleModal: jest.fn(),
      })

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

      fireEvent.press(button)

      fireEvent.press(screen.getByText('Activer la géolocalisation'))

      expect(mockHideModal).toHaveBeenCalledWith()
    })
  })

  describe('When user has forbidden his position', () => {
    beforeAll(() => {
      mockUseLocation.mockReturnValue({
        ...defaultUseLocation,
        geolocPosition: null,
        permissionState: GeolocPermissionState.DENIED,
      })
    })

    it('should ask for permission when pressing "Active ta géolocalisation" button and permission is denied', () => {
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

      fireEvent.press(button)

      expect(mockRequestGeolocPermission).toHaveBeenCalledWith()
    })
  })
})
