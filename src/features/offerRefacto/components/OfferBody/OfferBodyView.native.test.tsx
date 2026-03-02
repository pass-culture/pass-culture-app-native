import React from 'react'
import { View } from 'react-native'

import { ChronicleCardData } from 'features/chronicle/type'
import { chronicleVariantInfoFixture } from 'features/offer/fixtures/chronicleVariantInfo'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferBodyViewModel } from 'features/offerRefacto/types'
import { render, screen } from 'tests/utils'

import { OfferBodyView } from './OfferBodyView'

jest.mock('features/offer/components/OfferBody/OfferBody', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require('react-native')
  return { OfferBody: () => <View testID="offer-body-content" /> }
})

jest.mock(
  'features/offer/components/OfferContent/ChronicleSection/ChroniclesSectionWithAnchor',
  () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { View } = require('react-native')
    return { ChroniclesSectionWithAnchor: () => <View testID="chronicles-section" /> }
  }
)

jest.mock('features/offer/components/OfferImageContainer/OfferImageContainer', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require('react-native')
  return { OfferImageContainer: () => <View testID="offer-image-container" /> }
})

jest.mock('features/offer/components/OfferMessagingApps/OfferMessagingApps', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require('react-native')
  return { OfferMessagingApps: () => <View testID="offer-messaging-apps" /> }
})

jest.mock('features/offer/components/OfferPlaylistList/OfferPlaylistList', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require('react-native')
  return { OfferPlaylistList: () => <View testID="offer-playlist-list" /> }
})

const mockViewModel: OfferBodyViewModel = {
  offerImages: [],
  placeholderImage: undefined,
  imageDimensions: {
    backgroundHeight: 100,
    imageStyle: { height: 200, width: 150, maxWidth: 300, aspectRatio: 2 / 3, borderRadius: 8 },
  },
  distance: null,
  sameCategorySimilarOffers: [],
  apiRecoParamsSameCategory: undefined,
  otherCategoriesSimilarOffers: [],
  apiRecoParamsOtherCategories: undefined,
  onSeeMoreButtonPress: jest.fn(),
  onSeeAllReviewsPress: jest.fn(),
  onViewableItemsChanged: jest.fn(),
}

const mockChronicle: ChronicleCardData = {
  id: 1,
  title: 'Test chronicle',
  subtitle: 'subtitle',
  description: 'description',
  date: '2025-01-01',
}

const BodyWrapper = ({ children }: React.PropsWithChildren) => (
  <View testID="body-wrapper">{children}</View>
)

describe('<OfferBodyView />', () => {
  it('should render the image container', () => {
    renderOfferBodyView()

    expect(screen.getByTestId('offer-image-container')).toBeOnTheScreen()
  })

  it('should render the offer body content', () => {
    renderOfferBodyView()

    expect(screen.getByTestId('offer-body-content')).toBeOnTheScreen()
  })

  it('should render the messaging apps section', () => {
    renderOfferBodyView()

    expect(screen.getByTestId('messagingApp-container-with-divider')).toBeOnTheScreen()
  })

  it('should render the playlist list', () => {
    renderOfferBodyView()

    expect(screen.getByTestId('offer-playlist-list')).toBeOnTheScreen()
  })

  it('should render chronicles section when chronicles are provided', () => {
    renderOfferBodyView({ chronicles: [mockChronicle] })

    expect(screen.getByTestId('chronicles-section')).toBeOnTheScreen()
  })

  it('should not render chronicles section when no chronicles', () => {
    renderOfferBodyView()

    expect(screen.queryByTestId('chronicles-section')).not.toBeOnTheScreen()
  })

  it('should render children', () => {
    render(
      <OfferBodyView
        viewModel={mockViewModel}
        offer={offerResponseSnap}
        subcategory={mockSubcategory}
        searchGroupList={[]}
        chronicleVariantInfo={chronicleVariantInfoFixture}
        onShowOfferArtistsModal={jest.fn()}
        onShowChroniclesWritersModal={jest.fn()}
        onOfferPreviewPress={jest.fn()}
        BodyWrapper={BodyWrapper}>
        <View testID="test-child" />
      </OfferBodyView>
    )

    expect(screen.getByTestId('test-child')).toBeOnTheScreen()
  })
})

const renderOfferBodyView = (overrides: { chronicles?: ChronicleCardData[] } = {}) => {
  render(
    <OfferBodyView
      viewModel={mockViewModel}
      offer={offerResponseSnap}
      subcategory={mockSubcategory}
      searchGroupList={[]}
      chronicleVariantInfo={chronicleVariantInfoFixture}
      onShowOfferArtistsModal={jest.fn()}
      onShowChroniclesWritersModal={jest.fn()}
      onOfferPreviewPress={jest.fn()}
      BodyWrapper={BodyWrapper}
      {...overrides}
    />
  )
}
