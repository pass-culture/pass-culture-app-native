import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, ReactNode } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum, OfferResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferAbout } from 'features/offer/components/OfferAbout/OfferAbout'
import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { ProposedBySection } from 'features/offer/components/OfferBody/ProposedBySection/ProposedBySection'
import { OfferPlace } from 'features/offer/components/OfferPlace/OfferPlace'
import { OfferReactionSection } from 'features/offer/components/OfferReactionSection/OfferReactionSection'
import { OfferSummaryInfoList } from 'features/offer/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { OfferTitle } from 'features/offer/components/OfferTitle/OfferTitle'
import { OfferVenueButton } from 'features/offer/components/OfferVenueButton/OfferVenueButton'
import { getOfferMetadata } from 'features/offer/helpers/getOfferMetadata/getOfferMetadata'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'
import { useOfferSummaryInfoList } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { Subcategory } from 'libs/subcategories/types'
import { useArtistResultsQuery } from 'queries/offer/useArtistResultsQuery'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offer: OfferResponseV2
  subcategory: Subcategory
  children: ReactNode
  likesCount?: number
  chroniclesCount?: number
  distance?: string | null
  headlineOffersCount?: number
}

export const OfferBody: FunctionComponent<Props> = ({
  offer,
  subcategory,
  children,
  likesCount,
  chroniclesCount,
  distance,
  headlineOffersCount,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const hasArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)

  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

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

  const { artistPlaylist: artistOffers } = useArtistResultsQuery({
    artistId: artists.length > 0 ? artists[0]?.id : undefined,
    subcategoryId: offer.subcategoryId,
  })

  const hasAccessToArtistPage = hasArtistPage && artists.length === 1 && artistOffers?.length > 1

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

  const handleArtistLinkPress = () => {
    if (!artists[0]) return
    const mainArtistName = artists[0].name
    analytics.logConsultArtist({ offerId: offer.id, artistName: mainArtistName, from: 'offer' })
    navigate('Artist', { id: artists[0].id })
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

  const hasSameAddress = fullAddressOffer === fullAddressVenue

  const hasVenuePage = offer.venue.isPermanent

  return (
    <Container>
      <MarginContainer gap={6}>
        <GroupWithoutGap>
          <ViewGap gap={4}>
            <InformationTags tags={tags} />
            <ViewGap gap={2}>
              <OfferTitle offerName={offer.name} />
              {artists.length > 0 ? (
                <OfferArtists
                  artists={artists.map((artist) => artist.name).join(', ')}
                  onPressArtistLink={hasAccessToArtistPage ? handleArtistLinkPress : undefined}
                />
              ) : null}
            </ViewGap>
          </ViewGap>
        </GroupWithoutGap>

        {prices ? <Typo.Title3 {...getHeadingAttrs(2)}>{displayedPrice}</Typo.Title3> : null}

        <OfferReactionSection
          likesCount={likesCount}
          chroniclesCount={chroniclesCount}
          headlineOffersCount={headlineOffersCount}
        />

        <GroupWithSeparator
          showTopComponent={hasVenuePage}
          TopComponent={
            isCinemaOffer || !hasSameAddress ? null : <OfferVenueButton venue={offer.venue} />
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

      {hasSameAddress ? null : (
        <ProposedBySection
          name={offer.venue.name}
          imageUrl={offer.venue.bannerUrl}
          navigateTo={
            hasVenuePage ? { screen: 'Venue', params: { id: offer.venue.id } } : undefined
          }
        />
      )}

      <OfferPlace offer={offer} subcategory={subcategory} distance={distance} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexShrink: 1,
  width: '100%',
  gap: theme.isDesktopViewport ? getSpacing(16) : getSpacing(8),
  marginBottom: theme.isDesktopViewport ? 0 : getSpacing(8),
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
