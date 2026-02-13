import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, ReactNode, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum, OfferArtist, OfferResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferAbout } from 'features/offer/components/OfferAbout/OfferAbout'
import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { ProposedBySection } from 'features/offer/components/OfferBody/ProposedBySection/ProposedBySection'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
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
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Subcategory } from 'libs/subcategories/types'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GroupTags } from 'ui/GroupTags/GroupTags'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offer: OfferResponseV2
  subcategory: Subcategory
  children: ReactNode
  chronicleVariantInfo: ChronicleVariantInfo
  onVideoConsentPress: () => void
  onShowOfferArtistsModal: (artists: OfferArtist[]) => void
  likesCount?: number
  chroniclesCount?: number | null
  distance?: string | null
  headlineOffersCount?: number
  chronicles?: ChronicleCardData[]
  isVideoSectionEnabled?: boolean
  hasVideoCookiesConsent?: boolean
  isMultiArtistsEnabled?: boolean
}

export const OfferBody: FunctionComponent<Props> = ({
  offer,
  subcategory,
  children,
  likesCount,
  chroniclesCount,
  distance,
  headlineOffersCount,
  chronicleVariantInfo,
  chronicles,
  isVideoSectionEnabled,
  hasVideoCookiesConsent,
  isMultiArtistsEnabled,
  onVideoConsentPress,
  onShowOfferArtistsModal,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Offer'>>()

  useEffect(() => {
    if (params.from === 'deeplink') {
      triggerConsultOfferLog({ offerId: params.id, from: 'deeplink' })
    }
  }, [isVideoSectionEnabled, params])

  const hasArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)

  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

  const extraData = offer.extraData ?? undefined
  const tags = getOfferTags(subcategory.appLabel, extraData)
  const artists = offer.artists
  const prices = getOfferPrices(offer.stocks)

  const displayedPrice = getDisplayedPrice(
    prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isFixed: getIfPricesShouldBeFixed(offer.subcategoryId),
      isDuo: !!(offer.isDuo && user?.isBeneficiary),
    }),
    { fractionDigits: 2 }
  )

  const hasAccessToArtistPage = isMultiArtistsEnabled
    ? hasArtistPage
    : hasArtistPage && artists.length === 1

  const isCinemaOffer = subcategory.categoryId === CategoryIdEnum.CINEMA

  const { summaryInfoItems } = useOfferSummaryInfoList({
    offer,
    isCinemaOffer,
  })

  const metadata = getOfferMetadata(extraData)
  const hasMetadata = metadata.length > 0
  const shouldDisplayAccessibilitySection = !(
    isNullOrUndefined(offer.accessibility.visualDisability) &&
    isNullOrUndefined(offer.accessibility.audioDisability) &&
    isNullOrUndefined(offer.accessibility.mentalDisability) &&
    isNullOrUndefined(offer.accessibility.motorDisability)
  )

  const shouldDisplayAboutSection =
    shouldDisplayAccessibilitySection || !!offer.description || hasMetadata

  const handleArtistLinkPress = (artists: OfferArtist[]) => {
    if (artists.length === 0) return

    if (artists.length === 1) {
      const artist = artists[0]
      if (artist && artist.id) {
        void analytics.logConsultArtist({
          offerId: offer.id.toString(),
          artistId: artist.id,
          artistName: artist.name,
          from: 'offer',
        })
        navigate('Artist', { id: artist.id })
      }
      return
    }

    onShowOfferArtistsModal(artists)
  }

  const handleManageCookiesPress = () => {
    navigate('ProfileStackNavigator', { screen: 'ConsentSettings', params: { offerId: offer.id } })
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
            <ViewGap gap={2}>
              <OfferTitle offerName={offer.name} />
              {artists.length > 0 ? (
                <OfferArtists
                  artists={artists}
                  isMultiArtistsEnabled={isMultiArtistsEnabled}
                  onPressArtistLink={hasAccessToArtistPage ? handleArtistLinkPress : undefined}
                />
              ) : null}
            </ViewGap>
          </ViewGap>
        </GroupWithoutGap>

        {prices.length > 0 ? (
          <Typo.Title3 {...getHeadingAttrs(2)}>{displayedPrice}</Typo.Title3>
        ) : null}

        <OfferReactionSection
          likesCount={likesCount}
          chroniclesCount={chroniclesCount}
          headlineOffersCount={headlineOffersCount}
          chronicleVariantInfo={chronicleVariantInfo}
          chronicles={chronicles}
        />

        <GroupWithSeparator
          showTopComponent={hasVenuePage}
          TopComponent={
            isCinemaOffer || !isOfferAtSameAddressAsVenue ? null : (
              <OfferVenueButton venue={offer.venue} />
            )
          }
          showBottomComponent={summaryInfoItems.length > 0}
          BottomComponent={<OfferSummaryInfoList summaryInfoItems={summaryInfoItems} />}
        />
        {children}
      </MarginContainer>

      {shouldDisplayAboutSection ? (
        <MarginContainer gap={0}>
          <OfferAbout
            offer={offer}
            metadata={metadata}
            hasMetadata={hasMetadata}
            shouldDisplayAccessibilitySection={shouldDisplayAccessibilitySection}
          />
        </MarginContainer>
      ) : null}

      {offer.video?.id && isVideoSectionEnabled ? (
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
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexShrink: 1,
  width: '100%',
  gap: theme.isDesktopViewport ? getSpacing(16) : theme.designSystem.size.spacing.xxl,
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
