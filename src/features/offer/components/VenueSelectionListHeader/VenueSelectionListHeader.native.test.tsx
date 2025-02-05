import React from 'react'

import { VenueSelectionListHeader } from 'features/offer/components/VenueSelectionListHeader/VenueSelectionListHeader'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

describe('<VenueSelectionListHeader />', () => {
  describe('When wipAppV2SystemBlock feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK])
    })

    it('should display geolocation system banner when user has not a location', () => {
      render(
        <VenueSelectionListHeader
          subTitle="Sélectionner un lieu"
          headerMessage="Lieux à proximité"
          isSharingLocation={false}
        />
      )

      expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
    })
  })

  describe('When wipAppV2SystemBlock feature flag deactivated', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should display geolocation banner when user has not a location', () => {
      render(
        <VenueSelectionListHeader
          subTitle="Sélectionner un lieu"
          headerMessage="Lieux à proximité"
          isSharingLocation={false}
        />
      )

      expect(screen.getByTestId('genericBanner')).toBeOnTheScreen()
    })
  })

  it('should display subtitle', () => {
    render(
      <VenueSelectionListHeader
        subTitle="Sélectionner un lieu"
        headerMessage="Lieux à proximité"
        isSharingLocation={false}
      />
    )

    expect(screen.getByText('Sélectionner un lieu')).toBeOnTheScreen()
  })

  it('should display header message', () => {
    render(
      <VenueSelectionListHeader
        subTitle="Sélectionner un lieu"
        headerMessage="Lieux à proximité"
        isSharingLocation={false}
      />
    )

    expect(screen.getByText('Lieux à proximité')).toBeOnTheScreen()
  })

  it('should not display geolocation banner when user has a location', () => {
    render(
      <VenueSelectionListHeader
        subTitle="Sélectionner un lieu"
        headerMessage="Lieux à proximité"
        isSharingLocation
      />
    )

    expect(screen.queryByText('Active ta géolocalisation')).not.toBeOnTheScreen()
  })
})
