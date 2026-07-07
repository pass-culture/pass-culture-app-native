import React from 'react'
import { View, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ReactionTypeEnum, VenueResponse } from 'api/gen'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { getVenueBlock } from 'features/offer/components/OfferVenueBlock/getVenueBlock'
import { VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { FeedBack } from 'features/reactions/components/FeedBack'
import { OpeningHoursStatus } from 'features/venue/components/OpeningHoursStatus/OpeningHoursStatus'
import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { VolunteerCard } from 'features/venue/components/VenueTopComponent/VolunteerCard'
import { getVenueTopComponentTags } from 'features/venue/helpers/getVenueTopComponentTags'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { useLocation } from 'libs/location/location'
import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GroupTags } from 'ui/GroupTags/GroupTags'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: VenueResponse
  onPressBannerImage?: () => void
  enableVolunteer?: boolean
  enableVolunteerFeedback?: boolean
}

const VOLUNTEER_SMALL_CARD_HEIGHT = getSpacing(56.25)
const VOLUNTEER_LARGE_CARD_HEIGHT = getSpacing(73)

export const VenueTopComponentBase: React.FunctionComponent<Props> = ({
  venue,
  onPressBannerImage,
  enableVolunteer,
  enableVolunteerFeedback,
}) => {
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const focusProps = useHandleFocus()
  const { venueAddress, venueName } = getVenueBlock({
    venue: getVenue(venue),
  })
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()

  const { bannerUrl, bannerIsFromGoogle, bannerCredit } = venue

  const venueTags: string[] = getVenueTopComponentTags(
    venue,
    userLocation,
    selectedPlace,
    selectedLocationMode
  )
  const currentDate = new Date()

  const isDynamicOpeningHoursDisplayed = venue.openingHours && venue.isOpenToPublic

  const hasVolunteer = enableVolunteer && !!venue.volunteeringUrl

  const onPressVolunteeringCard = async () => {
    if (venue.volunteeringUrl) {
      await analytics.logClickVolunteerCTA({ from: 'venue', venueId: venue.id.toString() })
      await openUrl(
        `${venue.volunteeringUrl}?utm_source=pass-culture&utm_medium=app&utm_campaign=orga_non_inscrite`
      )
    }
  }

  const handleOnLogFeedback = (type: ReactionTypeEnum) => {
    const feedbackResponse = type === ReactionTypeEnum.LIKE ? 'Oui' : 'Non'
    void analytics.logFeatureFeedbackClicked({
      featureName: 'volunteer',
      feedbackResponse,
      from: 'venue',
      venueId: venue.id.toString(),
    })
  }

  return (
    <React.Fragment>
      <TopContainer hasVolunteer={hasVolunteer}>
        <VenueBanner
          bannerUrl={bannerUrl}
          bannerCredit={bannerCredit}
          bannerIsFromGoogle={bannerIsFromGoogle}
          handleImagePress={onPressBannerImage}
        />
        <MarginContainer>
          <ViewGap gap={4}>
            <GroupTags tags={venueTags} />
            <ViewGap gap={1}>
              <VenueTitle
                accessibilityLabel={`Nom du lieu\u00a0: ${venueName}`}
                adjustsFontSizeToFit>
                {venueName}
              </VenueTitle>
              {isDynamicOpeningHoursDisplayed ? (
                <OpeningHoursStatus
                  currentDate={currentDate}
                  openingHours={venue.openingHours}
                  timezone={venue.timezone}
                />
              ) : null}
              {venue.isOpenToPublic ? (
                <ViewGap gap={3}>
                  <View>
                    <Typo.BodyAccentXs>Adresse</Typo.BodyAccentXs>
                    <Typo.Body>{venueAddress}</Typo.Body>
                  </View>
                  <Separator.Horizontal />
                  <CopyToClipboardButton
                    wording="Copier l’adresse"
                    textToCopy={`${venueName}, ${venueAddress}`}
                    onCopy={() => analytics.logCopyAddress({ venueId: venue.id, from: 'venue' })}
                    snackBarMessage="L’adresse a bien été copiée."
                  />
                  <SeeItineraryButton
                    externalNav={{
                      url: getGoogleMapsItineraryUrl(venueAddress),
                      address: venueAddress,
                    }}
                    onPress={() =>
                      analytics.logConsultItinerary({ venueId: venue.id, from: 'venue' })
                    }
                  />
                </ViewGap>
              ) : null}
            </ViewGap>
          </ViewGap>
        </MarginContainer>
      </TopContainer>
      {hasVolunteer ? (
        <VolunteeringContainer gap={4}>
          <VolunteerCard
            height={
              theme.isDesktopViewport ? VOLUNTEER_LARGE_CARD_HEIGHT : VOLUNTEER_SMALL_CARD_HEIGHT
            }
            width={width}
            isFocus={focusProps.isFocus}
            venueName={venue.name}
            volunteeringUrl={venue.volunteeringUrl}
            accessibilityLabel={`Devenir bénévole pour ${venue.name} - Ouvre JeVeuxAider.gouv.fr | Devenez bénévole dans une association en quelques clics | La plateforme publique du bénévolat par la Réserve Civique`}
            onFocus={focusProps.onFocus}
            onBlur={focusProps.onBlur}
            onPress={onPressVolunteeringCard}
          />
          {enableVolunteerFeedback ? (
            <StyledFeedBack
              storageKey="volunteering_feedback"
              likeQuiz="https://passculture.qualtrics.com/jfe/form/SV_3sGi4gI6EEOmfsy"
              dislikeQuiz="https://passculture.qualtrics.com/jfe/form/SV_3sGi4gI6EEOmfsy"
              title="Le bénévolat sur le pass t’intéresse t-il&nbsp;?"
              onLogReaction={handleOnLogFeedback}
            />
          ) : null}
        </VolunteeringContainer>
      ) : null}
    </React.Fragment>
  )
}

const TopContainer = styled.View<{ hasVolunteer?: boolean }>(({ theme, hasVolunteer }) => {
  const isLargeScreen = theme.isDesktopViewport || theme.isTabletViewport
  return {
    flexDirection: isLargeScreen ? 'row' : 'column',
    marginTop: isLargeScreen ? theme.designSystem.size.spacing.xxl : 0,
    marginHorizontal: isLargeScreen ? theme.designSystem.size.spacing.xl : 0,
    marginBottom:
      isLargeScreen && !hasVolunteer
        ? theme.designSystem.size.spacing.xxxl
        : theme.designSystem.size.spacing.xl,
  }
})

const VenueTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))``

const MarginContainer = styled.View(({ theme }) => ({
  marginLeft: theme.isDesktopViewport ? getSpacing(13.5) : theme.designSystem.size.spacing.xl,
  marginRight: theme.designSystem.size.spacing.xl,
  flexShrink: 1,
  justifyContent: 'center',
}))

const getVenue = (venue: VenueResponse): VenueBlockVenue => {
  return {
    ...venue,
    bannerUrl: venue.bannerUrl ?? undefined,
    address: venue.street,
    coordinates: {},
  }
}

const VolunteeringContainer = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledFeedBack = styled(FeedBack)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  width: theme.isDesktopViewport ? '50%' : undefined,
}))
