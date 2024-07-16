import BottomSheet, { BottomSheetProps, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import styled from 'styled-components/native'

import { VenueMapPreview } from 'features/venueMap/components/VenueMapPreview/VenueMapPreview'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getVenueTags } from 'features/venueMap/helpers/getVenueTags/getVenueTags'
import { useDistance } from 'libs/location/hooks/useDistance'
import { parseType } from 'libs/parsers/venueType'
import { getSpacing } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(12)

export interface VenueMapBottomSheetProps extends Omit<BottomSheetProps, 'children'> {
  onClose?: () => void
  venue?: GeolocatedVenue | null
}

export const VenueMapBottomSheet = forwardRef<BottomSheetMethods, VenueMapBottomSheetProps>(
  function VenueMapBottomSheet({ onClose, venue, ...bottomSheetProps }, ref) {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const handleClose = () => {
      bottomSheetRef.current?.close()
      onClose?.()
    }

    // Plug internal Ref to an external Ref
    useImperativeHandle<Partial<BottomSheetMethods>, Partial<BottomSheetMethods>>(ref, () => ({
      close: bottomSheetRef.current?.close,
      snapToIndex: bottomSheetRef.current?.snapToIndex,
    }))

    const distanceToVenue = useDistance({
      lat: venue?._geoloc.lat,
      lng: venue?._geoloc.lng,
    })

    const venueTags = useMemo(() => {
      if (!venue) {
        return []
      }

      const venueTypeLabel = parseType(venue?.venue_type)
      return getVenueTags({ distance: distanceToVenue, venue_type: venueTypeLabel })
    }, [venue, distanceToVenue])

    return (
      <StyledBottomSheet ref={bottomSheetRef} {...bottomSheetProps}>
        <StyledBottomSheetView>
          {venue ? (
            <VenueMapPreview
              venueName={venue.label}
              onClose={handleClose}
              address={`${venue?.info}, ${venue?.postalCode}`}
              bannerUrl={venue.banner_url ?? ''}
              imageWidth={VENUE_THUMBNAIL_SIZE}
              imageHeight={VENUE_THUMBNAIL_SIZE}
              tags={venueTags}
              navigateTo={{ screen: 'Venue', params: { id: venue.venueId } }}
              noBorder
            />
          ) : null}
        </StyledBottomSheetView>
      </StyledBottomSheet>
    )
  }
)

const StyledBottomSheetView = styled(BottomSheetView)({
  paddingRight: getSpacing(4),
  paddingLeft: getSpacing(4),
  paddingTop: getSpacing(2),
})

const StyledBottomSheet = styled(BottomSheet).attrs<VenueMapBottomSheetProps>({
  containerStyle: { zIndex: 99 },
})``
