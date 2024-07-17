import BottomSheet, { BottomSheetProps, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { useNavigation } from '@react-navigation/native'
import React, { forwardRef, Fragment, useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueOfferPlaylist } from 'features/venueMap/components/VenueMapBottomSheet/VenueOfferPlaylist'
import { VenueMapPreview } from 'features/venueMap/components/VenueMapPreview/VenueMapPreview'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getVenueTags } from 'features/venueMap/helpers/getVenueTags/getVenueTags'
import { useDistance } from 'libs/location/hooks/useDistance'
import { parseType } from 'libs/parsers/venueType'
import { Offer } from 'shared/offer/types'
import { Separator } from 'ui/components/Separator'
import { getSpacing } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(12)

interface VenueMapBottomSheetProps extends Omit<BottomSheetProps, 'children'> {
  onClose?: () => void
  venue?: GeolocatedVenue | null
  venueOffers?: Offer[] | null
}

export const VenueMapBottomSheet = forwardRef<BottomSheetMethods, VenueMapBottomSheetProps>(
  function VenueMapBottomSheet({ onClose, venue, venueOffers, ...bottomSheetProps }, ref) {
    const distanceToVenue = useDistance({
      lat: venue?._geoloc.lat,
      lng: venue?._geoloc.lng,
    })
    const { navigate } = useNavigation<UseNavigationType>()

    const venueTags = useMemo(() => {
      if (!venue) {
        return []
      }
      const venueTypeLabel = parseType(venue?.venue_type)
      return getVenueTags({ distance: distanceToVenue, venue_type: venueTypeLabel })
    }, [venue, distanceToVenue])

    const offersPlaylist = useMemo(() => {
      if (Array.isArray(venueOffers) && venueOffers.length > 0) {
        const handlePressMore = venue ? () => navigate('Venue', { id: venue.venueId }) : undefined
        return (
          <Fragment>
            <StyledSeparator />
            <ScrollView>
              <VenueOfferPlaylist offers={venueOffers} onPressMore={handlePressMore} />
            </ScrollView>
          </Fragment>
        )
      }
      return null
    }, [venueOffers, navigate, venue])

    const venueMapPreview = useMemo(() => {
      if (venue) {
        return (
          <VenueMapPreview
            venueName={venue.label}
            onClose={onClose}
            iconSize={20}
            address={`${venue?.info}, ${venue?.postalCode}`}
            bannerUrl={venue.banner_url ?? ''}
            imageWidth={VENUE_THUMBNAIL_SIZE}
            imageHeight={VENUE_THUMBNAIL_SIZE}
            tags={venueTags}
            navigateTo={{ screen: 'Venue', params: { id: venue.venueId } }}
            noBorder
          />
        )
      }
      return null
    }, [venue, onClose, venueTags])

    return (
      <StyledBottomSheet ref={ref} index={venue ? 0 : -1} {...bottomSheetProps}>
        <StyledBottomSheetView>
          {venueMapPreview}
          {offersPlaylist}
        </StyledBottomSheetView>
      </StyledBottomSheet>
    )
  }
)

const StyledBottomSheetView = styled(BottomSheetView)({
  paddingRight: getSpacing(4),
  paddingLeft: getSpacing(4),
  paddingTop: getSpacing(2),
  flex: 1,
})

const StyledBottomSheet = styled(BottomSheet).attrs<VenueMapBottomSheetProps>({
  containerStyle: { zIndex: 99 },
})``

const StyledSeparator = styled(Separator.Horizontal)({
  marginTop: getSpacing(4),
  marginBottom: getSpacing(3),
})
