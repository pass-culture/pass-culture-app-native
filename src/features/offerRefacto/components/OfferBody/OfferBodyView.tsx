import React from 'react'
import styled from 'styled-components/native'

import { OfferBody as OfferBodyContent } from 'features/offer/components/OfferBody/OfferBody'
import { ChroniclesSectionWithAnchor } from 'features/offer/components/OfferContent/ChronicleSection/ChroniclesSectionWithAnchor'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferBodyViewProps } from 'features/offerRefacto/types'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

export const OfferBodyView = ({
  viewModel,
  offer,
  subcategory,
  chronicles,
  chronicleVariantInfo,
  headlineOffersCount,
  isVideoSectionEnabled,
  hasVideoCookiesConsent,
  onVideoConsentPress = () => {},
  isMultiArtistsEnabled,
  onShowOfferArtistsModal,
  onShowChroniclesWritersModal,
  onOfferPreviewPress,
  BodyWrapper = React.Fragment,
  desktopCTAs,
  children,
}: Readonly<OfferBodyViewProps>) => {
  const {
    offerImages,
    placeholderImage,
    imageDimensions,
    distance,
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
    onSeeMoreButtonPress,
    onSeeAllReviewsPress,
    onViewableItemsChanged,
  } = viewModel

  return (
    <React.Fragment>
      <BodyWrapper>
        <OfferImageContainer
          images={offerImages}
          categoryId={subcategory.categoryId}
          onPress={onOfferPreviewPress}
          placeholderImage={placeholderImage}
          imageDimensions={imageDimensions}
          offer={offer}
        />
        <OfferBodyContent
          offer={offer}
          subcategory={subcategory}
          likesCount={offer.reactionsCount.likes}
          chroniclesCount={offer.chroniclesCount}
          chronicles={chronicles}
          distance={distance}
          headlineOffersCount={headlineOffersCount}
          chronicleVariantInfo={chronicleVariantInfo}
          isVideoSectionEnabled={isVideoSectionEnabled}
          hasVideoCookiesConsent={hasVideoCookiesConsent}
          onVideoConsentPress={onVideoConsentPress}
          isMultiArtistsEnabled={isMultiArtistsEnabled}
          onShowOfferArtistsModal={onShowOfferArtistsModal}>
          {desktopCTAs}
        </OfferBodyContent>
      </BodyWrapper>

      {chronicles?.length ? (
        <ChroniclesSectionWithAnchor
          chronicles={chronicles}
          chronicleVariantInfo={chronicleVariantInfo}
          offer={offer}
          onSeeMoreButtonPress={onSeeMoreButtonPress}
          onShowChroniclesWritersModal={onShowChroniclesWritersModal}
          onSeeAllReviewsPress={onSeeAllReviewsPress}
        />
      ) : null}

      <StyledSectionWithDivider visible margin testID="messagingApp-container-with-divider" gap={8}>
        <OfferMessagingApps offer={offer} />
      </StyledSectionWithDivider>

      <OfferPlaylistList
        offer={offer}
        sameCategorySimilarOffers={sameCategorySimilarOffers}
        apiRecoParamsSameCategory={apiRecoParamsSameCategory}
        otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
        apiRecoParamsOtherCategories={apiRecoParamsOtherCategories}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      {children}
    </React.Fragment>
  )
}

const StyledSectionWithDivider = styled(SectionWithDivider)(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.xxl,
}))
