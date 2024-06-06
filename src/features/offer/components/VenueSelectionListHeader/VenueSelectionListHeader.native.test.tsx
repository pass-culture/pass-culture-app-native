import React from 'react'

import { VenueSelectionListHeader } from 'features/offer/components/VenueSelectionListHeader/VenueSelectionListHeader'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

describe('<VenueSelectionListHeader />', () => {
  describe('When wipAppV2SystemBlock feature flag activated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
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
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(false)
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
