import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponse, SubcategoryIdEnum } from 'api/gen'
import { MovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/MovieScreeningCalendar'
import { OfferAbout } from 'features/offer/components/OfferAbout/OfferAbout'
import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlace } from 'features/offer/components/OfferPlace/OfferPlace'
import { OfferPrice } from 'features/offer/components/OfferPrice/OfferPrice'
import { OfferSummaryInfoList } from 'features/offer/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { OfferTitle } from 'features/offer/components/OfferTitle/OfferTitle'
import { OfferVenueButton } from 'features/offer/components/OfferVenueButton/OfferVenueButton'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'
import { useOfferSummaryInfoList } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Subcategory } from 'libs/subcategories/types'
import { FeatureFlag } from 'shared/FeatureFlag/FeatureFlag'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  offer: OfferResponse
  subcategory: Subcategory
  trackEventHasSeenOfferOnce: VoidFunction
}

export const OfferBody: FunctionComponent<Props> = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
}) => {
  const { isDesktopViewport } = useTheme()

  const extraData = offer.extraData ?? undefined
  const tags = getOfferTags(subcategory.appLabel, extraData)
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const prices = getOfferPrices(offer.stocks)

  const isOfferAMovieScreening = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  const { summaryInfoItems } = useOfferSummaryInfoList({ offer })
  return (
    <Container>
      <InfoContainer isDesktopViewport={isDesktopViewport}>
        <GroupWithoutGap>
          <InformationTags tags={tags} />
          <Spacer.Column numberOfSpaces={4} />
          <OfferTitle offerName={offer.name} />

          {artists ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={2} />
              <OfferArtists artists={artists} />
            </React.Fragment>
          ) : null}
        </GroupWithoutGap>

        {prices ? <OfferPrice prices={prices} /> : null}

        {!offer.venue.isPermanent && summaryInfoItems.length === 0 ? null : (
          <GroupWithoutGap>
            {offer.venue.isPermanent ? <OfferVenueButton venue={offer.venue} /> : null}

            {!offer.venue.isPermanent && summaryInfoItems.length === 0 ? null : (
              <Separator.Horizontal testID="topSeparator" />
            )}

            {summaryInfoItems.length === 0 ? null : (
              <OfferSummaryInfoList summaryInfoItems={summaryInfoItems} />
            )}
          </GroupWithoutGap>
        )}

        {isDesktopViewport ? (
          <OfferCTAButton
            offer={offer}
            subcategory={subcategory}
            trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
          />
        ) : null}

        <OfferAbout offer={offer} />
      </InfoContainer>

      <OfferPlace offer={offer} isEvent={subcategory.isEvent} />

      {isOfferAMovieScreening ? (
        <FeatureFlag featureFlag={RemoteStoreFeatureFlags.WIP_ENABLE_NEW_XP_CINE_FROM_OFFER}>
          <MovieScreeningCalendar offer={offer} subcategory={subcategory} />
        </FeatureFlag>
      ) : null}

      {isDesktopViewport ? (
        <View testID="messagingApp-container-without-divider">
          <OfferMessagingApps offer={offer} />
        </View>
      ) : (
        <SectionWithDivider visible margin testID="messagingApp-container-with-divider">
          <Spacer.Column numberOfSpaces={2} />
          <OfferMessagingApps offer={offer} />
        </SectionWithDivider>
      )}
    </Container>
  )
}

const Container = styled.View({ flexShrink: 1, width: '100%' })

const InfoContainer = styled.View<{ isDesktopViewport?: boolean }>(({ isDesktopViewport }) => ({
  gap: getSpacing(6),
  ...(!isDesktopViewport ? { marginHorizontal: getSpacing(6) } : {}),
}))

const GroupWithoutGap = View
