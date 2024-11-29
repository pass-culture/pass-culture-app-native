import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import * as useSubcategoryOfferLabelMapping from 'libs/subcategories/mappings'
import { SubcategoryOfferLabelMapping } from 'libs/subcategories/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const useSubcategoryOfferLabelMappingSpy = jest.spyOn(
  useSubcategoryOfferLabelMapping,
  'useSubcategoryOfferLabelMapping'
)

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

describe('ArtistPlaylist', () => {
  it('should display artist playlist when there is some offer from this artist', () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          offer={mockOffer}
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getByText('Toutes ses offres disponibles')).toBeOnTheScreen()
    expect(screen.getByText('Manga Série "One piece" - Tome 5')).toBeOnTheScreen()
  })

  it('should not display artist playlist when there is not some offer from this artist', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist offer={mockOffer} artistName="Céline Dion" items={[]} />
      )
    )

    expect(screen.queryByText('Toutes ses offres disponibles')).not.toBeOnTheScreen()
    expect(screen.queryByText('Manga Série "One piece" - Tome 5')).not.toBeOnTheScreen()
  })

  it('should use bookFormat if available in offer.extraData', () => {
    const offer = {
      ...mockOffer,
      extraData: { bookFormat: 'Livre broché' },
    }

    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          offer={offer}
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getAllByText('Livre broché')[0]).toBeOnTheScreen()
  })

  it('should fallback to labelMapping if bookFormat is not available', () => {
    const offer = {
      ...mockOffer,
      extraData: {},
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
    }

    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          offer={offer}
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getAllByText('Livre')[0]).toBeOnTheScreen()
  })

  it('should set categoryLabel to an empty string when neither bookFormat nor subcategoryId is available', () => {
    // The spyOn is added to mock the `useSubcategoryOfferLabelMapping` function
    // and provide a custom mapping object that explicitly maps `ABO_CONCERT` to `null`.
    // This allows testing a case where neither `bookFormat` nor `subcategoryId`
    // provides a valid value.

    useSubcategoryOfferLabelMappingSpy.mockReturnValueOnce({
      ABO_CONCERT: null,
    } as SubcategoryOfferLabelMapping)

    // The `as SubcategoryOfferLabelMapping` is used here to avoid adding all 68
    // values of the `SubcategoryOfferLabelMapping` enum, which would be tedious
    // and unnecessary for this specific test. It forces TypeScript to accept
    // the partial mapping provided for the test.

    const offer = {
      ...mockOffer,
      extraData: {},
      subcategoryId: SubcategoryIdEnum.ABO_CONCERT,
    }

    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          offer={offer}
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.queryByText('Livre broché')).not.toBeOnTheScreen()
    expect(screen.queryByText('Livre')).not.toBeOnTheScreen()
  })
})
