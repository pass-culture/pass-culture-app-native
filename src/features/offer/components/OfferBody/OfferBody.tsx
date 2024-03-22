import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponse, SearchGroupNameEnumv2, SubcategoryIdEnum } from 'api/gen'
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
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
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

const FAKE_DOOR_ARTIST_SEARCH_GROUPS = [
  SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
  SearchGroupNameEnumv2.LIVRES,
  SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
]

export const OfferBody: FunctionComponent<Props> = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
}) => {
  const { isDesktopViewport } = useTheme()
  const hasFakeDoorArtist = useFeatureFlag(RemoteStoreFeatureFlags.FAKE_DOOR_ARTIST)
  const shouldDisplayFakeDoorArtist =
    hasFakeDoorArtist && FAKE_DOOR_ARTIST_SEARCH_GROUPS.includes(subcategory.searchGroupName)

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
              <OfferArtists artists={artists} shouldDisplayFakeDoor={shouldDisplayFakeDoorArtist} />
            </React.Fragment>
          ) : null}
        </GroupWithoutGap>

        {prices ? <OfferPrice prices={prices} /> : null}

        <GroupWithSeparator
          showTopComponent={offer.venue.isPermanent}
          TopComponent={() => <OfferVenueButton venue={offer.venue} />}
          showBottomComponent={summaryInfoItems.length > 0}
          BottomComponent={() => <OfferSummaryInfoList summaryInfoItems={summaryInfoItems} />}
        />

        {isDesktopViewport ? (
          <React.Fragment>
            <OfferCTAButton
              offer={offer}
              subcategory={subcategory}
              trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
            />
            <Spacer.Column numberOfSpaces={4} />
          </React.Fragment>
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
          <Spacer.Column numberOfSpaces={2} />
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

type GroupWithSeparatorProps = {
  showTopComponent: boolean
  TopComponent: FunctionComponent
  showBottomComponent: boolean
  BottomComponent: FunctionComponent
}
const GroupWithSeparator = ({
  showTopComponent,
  TopComponent,
  showBottomComponent,
  BottomComponent,
}: GroupWithSeparatorProps) =>
  showTopComponent || showBottomComponent ? (
    <GroupWithoutGap>
      {showTopComponent ? <TopComponent /> : null}

      {!showTopComponent && showBottomComponent ? (
        <Separator.Horizontal testID="topSeparator" />
      ) : null}

      {showBottomComponent ? <BottomComponent /> : null}
    </GroupWithoutGap>
  ) : null
