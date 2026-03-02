import { useRoute } from '@react-navigation/native'
import React, { ComponentType, FunctionComponent, PropsWithChildren } from 'react'
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { OfferArtist, ReactionTypeEnum } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { ChroniclesSectionWithAnchor } from 'features/offer/components/OfferContent/ChronicleSection/ChroniclesSectionWithAnchor'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferContentCTAs } from 'features/offer/components/OfferFooter/OfferContentCTAs'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferReactionHeaderButton } from 'features/offer/components/OfferHeader/OfferReactionHeaderButton'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { useOfferBodyData } from 'features/offer/hooks/useOfferBodyData'
import { useOfferContentTracking } from 'features/offer/hooks/useOfferContentTracking'
import { useOfferFavorites } from 'features/offer/hooks/useOfferFavorites'
import { useOfferScroll } from 'features/offer/hooks/useOfferScroll'
import { OfferBodyComponentProps, OfferContentProps } from 'features/offer/types'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

type OfferContentBaseProps = OfferContentProps &
  PropsWithChildren<{
    BodyWrapper: ComponentType<PropsWithChildren>
    onOfferPreviewPress: (index?: number) => void
    onShowChroniclesWritersModal: () => void
    onShowOfferArtistsModal: (artists: OfferArtist[]) => void
    onVideoConsentPress?: () => void
    chronicles?: ChronicleCardData[]
    headlineOffersCount?: number
    defaultReaction?: ReactionTypeEnum | null
    onReactionButtonPress?: () => void
    contentContainerStyle?: StyleProp<ViewStyle>
    onLayout?: (params: LayoutChangeEvent) => void
    chronicleVariantInfo?: ChronicleVariantInfo
    isVideoSectionEnabled?: boolean
  }>

// ---------------------------------------------------------------------------
// DefaultBodyContent — backward-compat body when no BodyComponent is provided
// ---------------------------------------------------------------------------

const noop = () => undefined

const DefaultBodyContent: FunctionComponent<OfferBodyComponentProps> = ({
  offer,
  subcategory,
  searchGroupList,
  userId,
  chronicles,
  chronicleVariantInfo,
  headlineOffersCount,
  isVideoSectionEnabled,
  hasVideoCookiesConsent,
  onVideoConsentPress,
  isMultiArtistsEnabled,
  onShowOfferArtistsModal,
  onShowChroniclesWritersModal,
  onOfferPreviewPress,
  BodyWrapper = React.Fragment,
  desktopCTAs,
  children,
}) => {
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
  } = useOfferBodyData({ offer, subcategory, searchGroupList, userId })

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
        <OfferBody
          offer={offer}
          subcategory={subcategory}
          likesCount={offer.reactionsCount.likes}
          chroniclesCount={offer.chroniclesCount}
          chronicles={chronicles}
          distance={distance}
          headlineOffersCount={headlineOffersCount}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          chronicleVariantInfo={chronicleVariantInfo!}
          isVideoSectionEnabled={isVideoSectionEnabled}
          hasVideoCookiesConsent={hasVideoCookiesConsent}
          onVideoConsentPress={onVideoConsentPress ?? noop}
          isMultiArtistsEnabled={isMultiArtistsEnabled}
          onShowOfferArtistsModal={onShowOfferArtistsModal}>
          {desktopCTAs}
        </OfferBody>
      </BodyWrapper>

      {chronicles?.length && chronicleVariantInfo ? (
        <ChroniclesSectionWithAnchor
          chronicles={chronicles}
          chronicleVariantInfo={chronicleVariantInfo}
          offer={offer}
          onSeeMoreButtonPress={onSeeMoreButtonPress}
          onShowChroniclesWritersModal={onShowChroniclesWritersModal}
          onSeeAllReviewsPress={onSeeAllReviewsPress}
        />
      ) : null}

      <DefaultBodySectionWithDivider
        visible
        margin
        testID="messagingApp-container-with-divider"
        gap={8}>
        <OfferMessagingApps offer={offer} />
      </DefaultBodySectionWithDivider>

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

// ---------------------------------------------------------------------------
// OfferContentBase — orchestration (scroll, header, footer)
// ---------------------------------------------------------------------------

export const OfferContentBase: FunctionComponent<OfferContentBaseProps> = ({
  offer,
  searchGroupList,
  subcategory,
  chronicles,
  chronicleVariantInfo,
  headlineOffersCount,
  onOfferPreviewPress,
  contentContainerStyle,
  defaultReaction,
  onReactionButtonPress,
  onShowChroniclesWritersModal,
  isVideoSectionEnabled,
  BodyWrapper = React.Fragment,
  onLayout,
  userId,
  hasVideoCookiesConsent,
  onVideoConsentPress,
  isMultiArtistsEnabled,
  onShowOfferArtistsModal,
  HeaderComponent,
  BodyComponent,
  children,
}) => {
  const HeaderToRender = HeaderComponent || OfferHeader
  const BodyToRender = BodyComponent ?? DefaultBodyContent
  const theme = useTheme()

  const { params } = useRoute<UseRouteType<'Offer'>>()

  const { scrollListener, trackEventHasSeenOfferOnce } = useOfferContentTracking({
    offerId: offer.id,
    subcategoryId: subcategory.id,
  })
  const { scrollViewRef, headerTransition, handleScroll, handleCheckScrollY } = useOfferScroll({
    scrollListener,
  })
  const favoriteButtonProps = useOfferFavorites(offer, params)

  const offerCtaButton = (
    <OfferCTAButton
      offer={offer}
      subcategory={subcategory}
      trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
    />
  )

  const desktopCTAs = theme.isDesktopViewport ? (
    <OfferContentCTAs offer={offer} {...favoriteButtonProps}>
      {offerCtaButton}
    </OfferContentCTAs>
  ) : null

  return (
    <Container>
      <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
        <OfferWebMetaHeader offer={offer} />
        <HeaderToRender title={offer.name} headerTransition={headerTransition} offer={offer}>
          {onReactionButtonPress ? (
            <OfferReactionHeaderButton
              onPress={onReactionButtonPress}
              defaultReaction={defaultReaction}
            />
          ) : (
            <FavoriteButton offerId={offer.id} {...favoriteButtonProps} />
          )}
        </HeaderToRender>
        <IntersectionObserverScrollView
          testID="offerv2-container"
          scrollEventThrottle={16}
          scrollIndicatorInsets={scrollIndicatorInsets}
          bounces={false}
          ref={scrollViewRef}
          contentContainerStyle={contentContainerStyle}
          onScroll={handleScroll}>
          <BodyToRender
            offer={offer}
            subcategory={subcategory}
            searchGroupList={searchGroupList}
            chronicles={chronicles}
            chronicleVariantInfo={chronicleVariantInfo}
            headlineOffersCount={headlineOffersCount}
            isVideoSectionEnabled={isVideoSectionEnabled}
            hasVideoCookiesConsent={hasVideoCookiesConsent}
            onVideoConsentPress={onVideoConsentPress}
            isMultiArtistsEnabled={isMultiArtistsEnabled}
            onShowOfferArtistsModal={onShowOfferArtistsModal}
            onShowChroniclesWritersModal={onShowChroniclesWritersModal}
            onOfferPreviewPress={onOfferPreviewPress}
            userId={userId}
            BodyWrapper={BodyWrapper}
            desktopCTAs={desktopCTAs}>
            {children}
          </BodyToRender>
        </IntersectionObserverScrollView>
        {theme.isMobileViewport ? (
          <FooterContainer>
            <OfferContentCTAs offer={offer} onLayout={onLayout} {...favoriteButtonProps}>
              {offerCtaButton}
            </OfferContentCTAs>
          </FooterContainer>
        ) : null}
      </AnchorProvider>
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const DefaultBodySectionWithDivider = styled(SectionWithDivider)(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.xxl,
}))

const Container = styled.View({
  flex: 1,
})

const FooterContainer = styled.View(({ theme }) => ({
  marginTop: theme.isDesktopViewport ? undefined : theme.designSystem.size.spacing.xxs,
}))
