import React from 'react'

import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

describe('OfferTileWrapper', () => {
  const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

  it('should display V2 playlist when FF activated', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderOfferTileWrapper()

    expect(await screen.findByTestId('playlist-card-offer-v2')).toBeOnTheScreen()
  })

  it('should NOT display V2 playlist when FF deactivated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderOfferTileWrapper()

    expect(screen.queryByTestId('playlist-card-offer-v2')).not.toBeTruthy()
  })
})

function renderOfferTileWrapper() {
  const mockOfferItem = mockedAlgoliaResponse.hits[0]
  const mockOfferItemSize = 1
  return render(
    reactQueryProviderHOC(
      <OfferTileWrapper item={mockOfferItem} width={mockOfferItemSize} height={mockOfferItemSize} />
    )
  )
}
