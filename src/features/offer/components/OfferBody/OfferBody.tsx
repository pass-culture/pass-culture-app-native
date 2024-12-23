import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CategoryIdEnum, OfferResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferAbout } from 'features/offer/components/OfferAbout/OfferAbout'
import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlace } from 'features/offer/components/OfferPlace/OfferPlace'
import { OfferReactionSection } from 'features/offer/components/OfferReactionSection/OfferReactionSection'
import { OfferSummaryInfoList } from 'features/offer/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { OfferTitle } from 'features/offer/components/OfferTitle/OfferTitle'
import { OfferVenueButton } from 'features/offer/components/OfferVenueButton/OfferVenueButton'
import {
  ARTIST_SURVEY_MODAL_DATA,
  COMMA_OR_SEMICOLON_REGEX,
  DEFAULT_SURVEY_MODAL_DATA,
  EXCLUDED_ARTISTS,
  FAKE_DOOR_ARTIST_SEARCH_GROUPS,
} from 'features/offer/helpers/constants'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
import { getOfferMetadata } from 'features/offer/helpers/getOfferMetadata/getOfferMetadata'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'
import { useArtistResults } from 'features/offer/helpers/useArtistResults/useArtistResults'
import { useOfferSummaryInfoList } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { analytics } from 'libs/analytics'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { Subcategory } from 'libs/subcategories/types'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { SurveyModal } from 'ui/components/modals/SurveyModal'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offer: OfferResponseV2
  subcategory: Subcategory
  trackEventHasSeenOfferOnce: VoidFunction
}

export const OfferBody: FunctionComponent<Props> = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
}) => {
  const { isDesktopViewport } = useTheme()
  const { visible, showModal, hideModal } = useModal()
  const { navigate } = useNavigation<UseNavigationType>()

  const [surveyModalState, setSurveyModalState] = useState(DEFAULT_SURVEY_MODAL_DATA)
  const hasFakeDoorArtist = useFeatureFlag(RemoteStoreFeatureFlags.FAKE_DOOR_ARTIST)
  const hasArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)

  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const shouldDisplayFakeDoorArtist =
    hasFakeDoorArtist && FAKE_DOOR_ARTIST_SEARCH_GROUPS.includes(subcategory.searchGroupName)

  const extraData = offer.extraData ?? undefined
  const tags = getOfferTags(subcategory.appLabel, extraData)
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const prices = getOfferPrices(offer.stocks)

  const displayedPrice = getDisplayedPrice(
    prices,
    currency,
    euroToPacificFrancRate,
    offer.isDuo && user?.isBeneficiary,
    { fractionDigits: 2 }
  )

  const { artistPlaylist: artistOffers } = useArtistResults({
    artists,
    searchGroupName: subcategory.searchGroupName,
  })

  const hasAccessToArtistPage =
    hasArtistPage &&
    artists &&
    artistOffers?.length > 1 &&
    !COMMA_OR_SEMICOLON_REGEX.test(artists) &&
    !EXCLUDED_ARTISTS.includes(artists.toLowerCase())
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
    if (shouldDisplayFakeDoorArtist) {
      setSurveyModalState(ARTIST_SURVEY_MODAL_DATA)
      analytics.logConsultArtistFakeDoor()
      showModal()
    } else {
      const mainArtistName = artists?.split(',')[0] ?? ''
      analytics.logConsultArtist({ offerId: offer.id, artistName: mainArtistName, from: 'offer' })
      navigate('Artist', { fromOfferId: offer.id })
    }
  }

  return (
    <React.Fragment>
      <Container>
        <MarginContainer gap={6}>
          <GroupWithoutGap>
            <ViewGap gap={4}>
              <InformationTags tags={tags} />
              <ViewGap gap={2}>
                <OfferTitle offerName={offer.name} />
                {artists ? (
                  <OfferArtists
                    artists={artists}
                    onPressArtistLink={hasAccessToArtistPage ? handleArtistLinkPress : undefined}
                  />
                ) : null}
              </ViewGap>
            </ViewGap>
          </GroupWithoutGap>

          {prices ? <TypoDS.Title3 {...getHeadingAttrs(2)}>{displayedPrice}</TypoDS.Title3> : null}

          <OfferReactionSection offer={offer} subcategory={subcategory} />

          <GroupWithSeparator
            showTopComponent={offer.venue.isPermanent}
            TopComponent={isCinemaOffer ? null : <OfferVenueButton venue={offer.venue} />}
            showBottomComponent={summaryInfoItems.length > 0}
            BottomComponent={<OfferSummaryInfoList summaryInfoItems={summaryInfoItems} />}
          />

          {isDesktopViewport ? (
            <OfferCTAButton
              offer={offer}
              subcategory={subcategory}
              trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
            />
          ) : null}
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

        <OfferPlace offer={offer} subcategory={subcategory} />

        {isDesktopViewport ? (
          <View testID="messagingApp-container-without-divider">
            <OfferMessagingApps offer={offer} />
          </View>
        ) : (
          <SectionWithDivider visible margin testID="messagingApp-container-with-divider" gap={8}>
            <OfferMessagingApps offer={offer} />
            <Spacer.Column numberOfSpaces={4} />
          </SectionWithDivider>
        )}
      </Container>
      <SurveyModal
        title={surveyModalState.title}
        visible={visible}
        hideModal={hideModal}
        surveyDescription={surveyModalState.description}
        surveyUrl={surveyModalState.surveyURL}
        Icon={BicolorCircledClock}
      />
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  flexShrink: 1,
  width: '100%',
  gap: theme.isDesktopViewport ? getSpacing(16) : getSpacing(8),
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
