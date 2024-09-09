import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CategoryIdEnum, OfferResponseV2, SearchGroupNameEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { EXCLUDED_ARTISTS } from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { OfferAbout } from 'features/offer/components/OfferAbout/OfferAbout'
import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlace } from 'features/offer/components/OfferPlace/OfferPlace'
import { OfferPrice } from 'features/offer/components/OfferPrice/OfferPrice'
import { OfferReactions } from 'features/offer/components/OfferReactions/OfferReactions'
import { OfferSummaryInfoList } from 'features/offer/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { OfferTitle } from 'features/offer/components/OfferTitle/OfferTitle'
import { OfferVenueButton } from 'features/offer/components/OfferVenueButton/OfferVenueButton'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
import { getOfferMetadata } from 'features/offer/helpers/getOfferMetadata/getOfferMetadata'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'
import { useOfferSummaryInfoList } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { Subcategory } from 'libs/subcategories/types'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { ToggleButton } from 'ui/components/buttons/ToggleButton'
import { SurveyModal } from 'ui/components/modals/SurveyModal'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  offer: OfferResponseV2
  subcategory: Subcategory
  trackEventHasSeenOfferOnce: VoidFunction
}

const FAKE_DOOR_ARTIST_SEARCH_GROUPS = [
  SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
  SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
]

const DEFAULT_SURVEY_MODAL_DATA = {
  title: 'Encore un peu de patience…',
  description: 'Cette action n’est pas encore disponible, mais elle le sera bientôt\u00a0!',
  surveyURL: '',
}

const ARTIST_SURVEY_MODAL_DATA = {
  title: 'Encore un peu de patience…',
  description:
    'Ce contenu n’est pas encore disponible.\n\nAide-nous à le mettre en place en répondant au questionnaire.',
  surveyURL: 'https://passculture.qualtrics.com/jfe/form/SV_6xRze4sgvlbHNd4',
}

const COMMA_OR_SEMICOLON_REGEX = /[,;]/

export const OfferBody: FunctionComponent<Props> = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
}) => {
  const { reactionFakeDoorCategories } = useRemoteConfigContext()
  const { isDesktopViewport } = useTheme()
  const { visible, showModal, hideModal } = useModal()
  const { navigate } = useNavigation<UseNavigationType>()

  const { isLoggedIn, user } = useAuthContext()
  const [surveyModalState, setSurveyModalState] = useState(DEFAULT_SURVEY_MODAL_DATA)
  const hasFakeDoorArtist = useFeatureFlag(RemoteStoreFeatureFlags.FAKE_DOOR_ARTIST)
  const hasArtistPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

  const enableReactionFakeDoor = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FAKE_DOOR)
  const shouldDisplayFakeDoorArtist =
    hasFakeDoorArtist && FAKE_DOOR_ARTIST_SEARCH_GROUPS.includes(subcategory.searchGroupName)
  const shouldDisplayReactionButton =
    enableReactionFakeDoor &&
    reactionFakeDoorCategories.categories.includes(subcategory.nativeCategoryId)

  const extraData = offer.extraData ?? undefined
  const tags = getOfferTags(subcategory.appLabel, extraData)
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const prices = getOfferPrices(offer.stocks)

  const hasAccessToArtistPage =
    hasArtistPage &&
    artists &&
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

  const onReactButtonPress = () => {
    setSurveyModalState(DEFAULT_SURVEY_MODAL_DATA)
    analytics.logConsultReactionFakeDoor({ from: subcategory.nativeCategoryId })
    showModal()
  }

  const handleArtistLinkPress = () => {
    if (shouldDisplayFakeDoorArtist) {
      setSurveyModalState(ARTIST_SURVEY_MODAL_DATA)
      analytics.logConsultArtistFakeDoor()
      showModal()
    } else {
      const mainArtistName = artists?.split(',')[0] ?? ''
      analytics.logConsultArtist({ offerId: offer.id, artistName: mainArtistName })
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

          {prices ? <OfferPrice prices={prices} /> : null}

          {isReactionFeatureActive ? (
            <OfferReactions user={user} isLoggedIn={isLoggedIn} offer={offer} />
          ) : null}

          {shouldDisplayReactionButton ? (
            <ToggleButton
              active={false}
              onPress={onReactButtonPress}
              label={{ active: 'Réagir', inactive: 'Réagir' }}
              accessibilityLabel={{ active: 'Réagir', inactive: 'Réagir' }}
              Icon={{ active: StyledThumbUp, inactive: StyledThumbUp }}
            />
          ) : null}

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

const StyledThumbUp = styled(ThumbUp).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
