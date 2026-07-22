import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, ReactNode, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum, OfferResponse } from 'api/gen'
import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { OfferAbout } from 'features/offer/components/OfferAbout/OfferAbout'
import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'
import { OfferArtistsSection } from 'features/offer/components/OfferArtistsSection/OfferArtistsSection'
import { ProposedBySection } from 'features/offer/components/OfferBody/ProposedBySection/ProposedBySection'
import { VideoSection } from 'features/offer/components/OfferContent/VideoSection/VideoSection'
import { OfferPlace } from 'features/offer/components/OfferPlace/OfferPlace'
import { OfferReactionSection } from 'features/offer/components/OfferReactionSection/OfferReactionSection'
import { OfferSummaryInfoList } from 'features/offer/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { OfferTitle } from 'features/offer/components/OfferTitle/OfferTitle'
import { OfferVenueButton } from 'features/offer/components/OfferVenueButton/OfferVenueButton'
import { getOfferMetadata } from 'features/offer/helpers/getOfferMetadata/getOfferMetadata'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'
import { useOfferSummaryInfoList } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatPrice, getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Subcategory } from 'libs/subcategories/types'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { AB_TESTS } from 'shared/useABSegment/abTests'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { isCurrentBeneficiary } from 'shared/user/checkStatusType'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GroupTags } from 'ui/GroupTags/GroupTags'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offer: OfferResponse
  subcategory: Subcategory
  children: ReactNode
  adviceVariantInfo?: AdviceVariantInfo
  onVideoConsentPress: () => void
  likesCount?: number
  clubAdvicesCount?: number | null
  proAdvicesCount?: number
  distance?: string | null
  headlineOffersCount?: number
  clubAdvices?: AdviceCardData[]
  proAdvices?: AdviceCardData[]
  hasVideoCookiesConsent?: boolean
  proAdvicesSegment?: string
}

export const OfferBody: FunctionComponent<Props> = ({
  offer,
  subcategory,
  children,
  likesCount,
  clubAdvicesCount,
  proAdvicesCount,
  distance,
  headlineOffersCount,
  adviceVariantInfo,
  clubAdvices,
  proAdvices,
  hasVideoCookiesConsent,
  proAdvicesSegment,
  onVideoConsentPress,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Offer'>>()

  useEffect(() => {
    if (params.from === 'deeplink') {
      triggerConsultOfferLog({ offerId: params.id, venueId: offer.venue.id, from: 'deeplink' })
    }
  }, [offer.venue.id, params.from, params.id])

  const enableOfferArtistSectionRefacto = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ARTIST_SECTION_REFACTO
  )

  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const proAdvicesOnVenueSegment = useABSegment(AB_TESTS.PRO_REVIEWS_ON_VENUE)

  const extraData = offer.extraData ?? undefined
  const tags = getOfferTags(subcategory.appLabel, extraData)
  const artists = offer.artists
  const prices = getOfferPrices(offer.stocks)

  const displayedPrice = getDisplayedPrice(
    prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isDuo: !!(offer.isDuo && isCurrentBeneficiary(user)),
    }),
    { fractionDigits: 2 }
  )

  const isCinemaOffer = subcategory.categoryId === CategoryIdEnum.CINEMA

  const { summaryInfoItems } = useOfferSummaryInfoList({
    offer,
    isCinemaOffer,
  })

  const metadata = getOfferMetadata(extraData, subcategory.categoryId, artists.length > 0)
  const hasMetadata = metadata.length > 0
  const shouldDisplayAccessibilitySection = !(
    isNullOrUndefined(offer.accessibility.visualDisability) &&
    isNullOrUndefined(offer.accessibility.audioDisability) &&
    isNullOrUndefined(offer.accessibility.mentalDisability) &&
    isNullOrUndefined(offer.accessibility.motorDisability)
  )

  const shouldDisplayAboutSection = !!offer.description || hasMetadata

  const handleManageCookiesPress = () => {
    navigate('ProfileStackNavigator', { screen: 'ConsentSettings', params: { offerId: offer.id } })
  }

  const handleOnArtistPlaylistItemPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({ artistId, artistName, from: 'offer' })
  }

  const fullAddressOffer = formatFullAddress(
    offer.address?.street,
    offer.address?.postalCode,
    offer.address?.city
  )
  const fullAddressVenue = formatFullAddress(
    offer.venue.address,
    offer.venue.postalCode,
    offer.venue.city
  )

  const isOfferAtSameAddressAsVenue = fullAddressOffer === fullAddressVenue

  const hasVenuePage = offer.venue.isPermanent

  return (
    <Container>
      <MarginContainer gap={6}>
        <GroupWithoutGap>
          <ViewGap gap={4}>
            <GroupTags tags={tags} />
            <OfferTitle offerName={offer.name} />
          </ViewGap>
        </GroupWithoutGap>

        {prices.length > 0 ? (
          <Typo.Title3 {...getHeadingAttrs(2)}>{displayedPrice}</Typo.Title3>
        ) : null}

        <OfferReactionSection
          likesCount={likesCount}
          clubAdvicesCount={clubAdvicesCount}
          headlineOffersCount={headlineOffersCount}
          adviceVariantInfo={adviceVariantInfo}
          clubAdvices={clubAdvices}
          proAdvicesCount={proAdvicesCount}
          proAdvices={proAdvices}
        />

        <GroupWithSeparator
          showTopComponent={hasVenuePage}
          TopComponent={
            isCinemaOffer || !isOfferAtSameAddressAsVenue ? null : (
              <OfferVenueButton
                venue={offer.venue}
                proAdvicesOnVenueSegment={proAdvicesOnVenueSegment}
              />
            )
          }
          showBottomComponent={summaryInfoItems.length > 0}
          BottomComponent={<OfferSummaryInfoList summaryInfoItems={summaryInfoItems} />}
        />
        {children}
      </MarginContainer>

      {shouldDisplayAboutSection ? (
        <MarginContainer gap={0}>
          <OfferAbout offer={offer} metadata={metadata} hasMetadata={hasMetadata} />
        </MarginContainer>
      ) : null}

      {enableOfferArtistSectionRefacto && artists.length > 0 ? (
        <MarginContainer gap={0}>
          <OfferArtistsSection
            artists={artists}
            offerCategoryId={subcategory.categoryId}
            offerSubcategoryId={offer.subcategoryId}
            offerSearchGroupName={subcategory.searchGroupName}
            offerId={offer.id}
            onPlaylistItemPress={handleOnArtistPlaylistItemPress}
          />
        </MarginContainer>
      ) : null}

      {shouldDisplayAccessibilitySection ? (
        <MarginContainer gap={0}>
          <OfferAccessibility accessibility={offer.accessibility} />
        </MarginContainer>
      ) : null}

      {offer.video?.id ? (
        <VideoSection
          videoId={offer.video.id}
          videoThumbnail={
            <VideoThumbnailImage url={offer.video.thumbUrl ?? ''} resizeMode="cover" />
          }
          title={offer.video?.title ?? offer.name}
          offerId={offer.id}
          duration={offer.video?.durationSeconds}
          hasVideoCookiesConsent={hasVideoCookiesConsent}
          onManageCookiesPress={handleManageCookiesPress}
          onVideoConsentPress={onVideoConsentPress}
        />
      ) : null}

      {isOfferAtSameAddressAsVenue ? null : (
        <ProposedBySection
          name={offer.venue.name}
          imageUrl={offer.venue.bannerUrl}
          navigateTo={
            hasVenuePage ? { screen: 'Venue', params: { id: offer.venue.id } } : undefined
          }
        />
      )}

      <OfferPlace
        offer={offer}
        subcategory={subcategory}
        distance={distance}
        isOfferAtSameAddressAsVenue={isOfferAtSameAddressAsVenue}
        proAdvicesOnOfferSegment={proAdvicesSegment}
        proAdvicesOnVenueSegment={proAdvicesOnVenueSegment}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexShrink: 1,
  width: '100%',
  gap: theme.designSystem.size.spacing.xxl,
  marginBottom: theme.isDesktopViewport ? 0 : theme.designSystem.size.spacing.xxl,
}))

const MarginContainer = styled(ViewGap)(({ theme }) =>
  theme.isDesktopViewport ? {} : { marginHorizontal: theme.contentPage.marginHorizontal }
)

const GroupWithoutGap = View

type GroupWithSeparatorProps = {
  showTopComponent: boolean
  TopComponent: React.ReactNode
  showBottomComponent: boolean
  BottomComponent: React.ReactNode
}
const GroupWithSeparator = ({
  showTopComponent,
  TopComponent,
  showBottomComponent,
  BottomComponent,
}: GroupWithSeparatorProps) => {
  const renderTopComponent = () => (showTopComponent ? TopComponent : null)
  const renderBottomComponent = () => (showBottomComponent ? BottomComponent : null)

  return showTopComponent || showBottomComponent ? (
    <GroupWithoutGap>
      {renderTopComponent()}

      {!showTopComponent && showBottomComponent ? (
        <Separator.Horizontal testID="topSeparator" />
      ) : null}

      {renderBottomComponent()}
    </GroupWithoutGap>
  ) : null
}

const VideoThumbnailImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
