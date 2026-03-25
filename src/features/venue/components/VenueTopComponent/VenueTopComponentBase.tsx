import React, { useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { getVenueBlock } from 'features/offer/components/OfferVenueBlock/getVenueBlock'
import { VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { OpeningHoursStatus } from 'features/venue/components/OpeningHoursStatus/OpeningHoursStatus'
import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/location'
import { MAP_ACTIVITY_TO_LABEL } from 'libs/parsers/activity'
import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { EditorialCard, EditorialCardInfo } from 'ui/components/EditorialCard'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { GroupTags } from 'ui/GroupTags/GroupTags'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: Omit<VenueResponse, 'isVirtual'>
  onPressBannerImage?: () => void
  enableVolunteer?: boolean
  enableVolunteerNewTag?: boolean
}

const VOLUNTEER_SMALL_CARD_HEIGHT = getSpacing(56.25)
const VOLUNTEER_LARGE_CARD_HEIGHT = getSpacing(58.25)

export const VenueTopComponentBase: React.FunctionComponent<Props> = ({
  venue,
  onPressBannerImage,
  enableVolunteer,
  enableVolunteerNewTag,
}) => {
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const focusProps = useHandleFocus()
  const { venueAddress, venueName } = getVenueBlock({
    venue: getVenue(venue),
  })
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()

  const { bannerUrl, bannerIsFromGoogle, bannerCredit } = venue

  const distanceToVenue = getDistance(
    { lat: venue.latitude, lng: venue.longitude },
    { userLocation, selectedPlace, selectedLocationMode }
  )
  const activityLabel = venue.activity ? MAP_ACTIVITY_TO_LABEL[venue.activity] : undefined

  const venueTags: string[] = []
  activityLabel && venueTags.push(activityLabel)
  distanceToVenue && venueTags.push(`À ${distanceToVenue}`)

  const currentDate = new Date()

  const isDynamicOpeningHoursDisplayed = venue.openingHours && venue.isOpenToPublic

  const hasVolunteer = enableVolunteer && !!venue.volunteeringUrl

  const editorialCardInfo: EditorialCardInfo = useMemo(
    () => ({
      imageURL:
        'https://cdn.phototourl.com/free/2026-03-24-5f1a4c71-c6d5-45b2-94b4-2273fe731437.jpg',
      url: venue.volunteeringUrl,
      title: `Deviens bénévole pour\n“${venue.name}”`,
      subtitle: 'Donne de ton temps pour la culture\u00a0!',
      callToAction: 'Voir les missions sur jeveuxaider.gouv',
    }),
    [venue.name, venue.volunteeringUrl]
  )

  const onPressVolunteeringCard = async () => {
    if (venue.volunteeringUrl) {
      await openUrl(venue.volunteeringUrl)
    }
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
        <CardWrapper>
          {enableVolunteerNewTag ? (
            <TagContainer>
              <Tag variant={TagVariant.NEW} label="Nouveau" />
            </TagContainer>
          ) : null}
          <EditorialCard
            height={
              theme.isDesktopViewport ? VOLUNTEER_LARGE_CARD_HEIGHT : VOLUNTEER_SMALL_CARD_HEIGHT
            }
            width={width}
            isFocus={focusProps.isFocus}
            editorialCardInfo={editorialCardInfo}
            accessibilityLabel={`Devenir bénévole pour ${venue.name} - Ouvre JeVeuxAider.gouv.fr | Devenez bénévole dans une association en quelques clics | La plateforme publique du bénévolat par la Réserve Civique`}
            onFocus={focusProps.onFocus}
            onBlur={focusProps.onBlur}
            onPress={onPressVolunteeringCard}
          />
        </CardWrapper>
      ) : null}
    </React.Fragment>
  )
}

const TopContainer = styled.View<{ hasVolunteer?: boolean }>(({ theme, hasVolunteer }) => {
  const isLargeScreen = theme.isDesktopViewport || theme.isTabletViewport
  return {
    flexDirection: isLargeScreen ? 'row' : 'column',
    marginTop: isLargeScreen ? theme.designSystem.size.spacing.xxl : 0,
    marginHorizontal: isLargeScreen ? getSpacing(18) : 0,
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

const getVenue = (venue: Omit<VenueResponse, 'isVirtual'>): VenueBlockVenue => {
  return {
    ...venue,
    bannerUrl: venue.bannerUrl ?? undefined,
    address: venue.street,
    coordinates: {},
  }
}

const CardWrapper = styled.View({
  position: 'relative',
})

const TagContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: theme.designSystem.size.spacing.l,
  left: theme.designSystem.size.spacing.xxxl,
  zIndex: 2,
  pointerEvents: 'none',
}))
