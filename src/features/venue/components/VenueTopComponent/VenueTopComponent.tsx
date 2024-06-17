import React from 'react'
import styled from 'styled-components/native'

import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { OpeningHoursStatus } from 'features/venue/components/OpeningHoursStatus/OpeningHoursStatus'
import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { useDistance } from 'libs/location/hooks/useDistance'
import { MAP_VENUE_TYPE_TO_LABEL } from 'libs/parsers/venueType'
import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { Separator } from 'ui/components/Separator'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: VenueResponse
}

export const VenueTopComponent: React.FunctionComponent<Props> = ({ venue }) => {
  const { bannerUrl, publicName, name, address, postalCode, city, bannerMeta } = venue

  const venueFullAddress = formatFullAddress(address, postalCode, city)
  const venueName = publicName || name

  const distanceToVenue = useDistance({ lat: venue.latitude, lng: venue.longitude })
  const venueTypeLabel =
    venue.venueTypeCode && venue.venueTypeCode !== VenueTypeCodeKey.ADMINISTRATIVE
      ? MAP_VENUE_TYPE_TO_LABEL[venue.venueTypeCode]
      : undefined

  const venueTags = []
  venueTypeLabel && venueTags.push(venueTypeLabel)
  distanceToVenue && venueTags.push(`À ${distanceToVenue}`)

  const hasGoogleCredit = bannerMeta?.is_from_google && bannerMeta?.image_credit

  const currentDate = new Date()
  const isDynamicOpeningHoursEnabled = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ENABLE_DYNAMIC_OPENING_HOURS
  )

  const isDynamicOpeningHoursDisplayed = isDynamicOpeningHoursEnabled && venue.openingHours
  return (
    <TopContainer>
      <VenueBanner bannerUrl={bannerUrl} bannerMeta={bannerMeta} />
      <Spacer.Column numberOfSpaces={hasGoogleCredit ? 2 : 6} />
      <MarginContainer>
        <InformationTags tags={venueTags} />
        <Spacer.Column numberOfSpaces={4} />
        <VenueTitle
          accessibilityLabel={`Nom du lieu\u00a0: ${venueName}`}
          adjustsFontSizeToFit
          allowFontScaling={false}>
          {venueName}
        </VenueTitle>
        <Spacer.Column numberOfSpaces={2} />
        {isDynamicOpeningHoursDisplayed ? (
          <React.Fragment>
            <OpeningHoursStatus currentDate={currentDate} openingHours={venue.openingHours} />
            <Spacer.Column numberOfSpaces={2} />
          </React.Fragment>
        ) : null}
        <Typo.Caption>Adresse</Typo.Caption>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Body>{venueFullAddress}</Typo.Body>
        <Spacer.Column numberOfSpaces={3} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={3} />
        <CopyToClipboardButton
          wording="Copier l’adresse"
          textToCopy={`${venueName}, ${venueFullAddress}`}
          onCopy={() => analytics.logCopyAddress({ venueId: venue.id, from: 'venue' })}
          snackBarMessage="L’adresse a bien été copiée."
        />
        <Spacer.Column numberOfSpaces={3} />
        <SeeItineraryButton
          externalNav={{
            url: getGoogleMapsItineraryUrl(venueFullAddress),
            address: venueFullAddress,
          }}
          onPress={() => analytics.logConsultItinerary({ venueId: venue.id, from: 'venue' })}
        />
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

const VenueTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))``

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
  flexShrink: 1,
})
