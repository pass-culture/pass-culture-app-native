import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { OpeningHoursStatus } from 'features/venue/components/OpeningHoursStatus/OpeningHoursStatus'
import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import { MAP_VENUE_TYPE_TO_LABEL } from 'libs/parsers/venueType'
import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: VenueResponse
  onPressBannerImage?: () => void
}

export const VenueTopComponentBase: React.FunctionComponent<Props> = ({
  venue,
  onPressBannerImage,
}) => {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()

  const { bannerUrl, publicName, name, address, postalCode, city, bannerMeta } = venue

  const venueFullAddress = formatFullAddress(address, postalCode, city)
  const venueName = publicName || name

  const distanceToVenue = getDistance(
    { lat: venue.latitude, lng: venue.longitude },
    { userLocation, selectedPlace, selectedLocationMode }
  )
  const venueTypeLabel =
    venue.venueTypeCode && venue.venueTypeCode !== VenueTypeCodeKey.ADMINISTRATIVE
      ? MAP_VENUE_TYPE_TO_LABEL[venue.venueTypeCode]
      : undefined

  const venueTags = []
  venueTypeLabel && venueTags.push(venueTypeLabel)
  distanceToVenue && venueTags.push(`À ${distanceToVenue}`)

  const currentDate = new Date()
  const isDynamicOpeningHoursEnabled = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ENABLE_DYNAMIC_OPENING_HOURS
  )

  const isDynamicOpeningHoursDisplayed = isDynamicOpeningHoursEnabled && venue.openingHours

  return (
    <TopContainer>
      <VenueBanner
        bannerUrl={bannerUrl}
        bannerMeta={bannerMeta}
        handleImagePress={onPressBannerImage}
      />
      <MarginContainer>
        <ViewGap gap={4}>
          <InformationTags tags={venueTags} />
          <ViewGap gap={1}>
            <VenueTitle accessibilityLabel={`Nom du lieu\u00a0: ${venueName}`} adjustsFontSizeToFit>
              {venueName}
            </VenueTitle>
            {isDynamicOpeningHoursDisplayed ? (
              <OpeningHoursStatus
                currentDate={currentDate}
                openingHours={venue.openingHours}
                timezone={venue.timezone}
              />
            ) : null}
            <ViewGap gap={3}>
              <View>
                <TypoDS.BodyAccentXs>Adresse</TypoDS.BodyAccentXs>
                <TypoDS.Body>{venueFullAddress}</TypoDS.Body>
              </View>
              <Separator.Horizontal />
              <CopyToClipboardButton
                wording="Copier l’adresse"
                textToCopy={`${venueName}, ${venueFullAddress}`}
                onCopy={() => analytics.logCopyAddress({ venueId: venue.id, from: 'venue' })}
                snackBarMessage="L’adresse a bien été copiée."
              />
              <SeeItineraryButton
                externalNav={{
                  url: getGoogleMapsItineraryUrl(venueFullAddress),
                  address: venueFullAddress,
                }}
                onPress={() => analytics.logConsultItinerary({ venueId: venue.id, from: 'venue' })}
              />
            </ViewGap>
          </ViewGap>
        </ViewGap>
      </MarginContainer>
    </TopContainer>
  )
}

const TopContainer = styled.View(({ theme }) => {
  const isLargeScreen = theme.isDesktopViewport || theme.isTabletViewport
  return {
    flexDirection: isLargeScreen ? 'row' : 'column',
    marginTop: isLargeScreen ? getSpacing(8) : 0,
    marginHorizontal: isLargeScreen ? getSpacing(18) : 0,
  }
})

const VenueTitle = styled(TypoDS.Title3).attrs(getHeadingAttrs(1))``

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
  flexShrink: 1,
})
