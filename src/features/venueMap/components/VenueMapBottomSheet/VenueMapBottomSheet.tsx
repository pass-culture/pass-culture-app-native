import BottomSheet, {
  BottomSheetHandleProps,
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { useNavigation } from '@react-navigation/native'
import React, { Fragment, FunctionComponent, forwardRef, useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { VenueMapOfferPlaylist } from 'features/venueMap/components/VenueMapBottomSheet/VenueMapOfferPlaylist'
import { VenueMapPreview } from 'features/venueMap/components/VenueMapPreview/VenueMapPreview'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getVenueTags } from 'features/venueMap/helpers/getVenueTags/getVenueTags'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import { parseType } from 'libs/parsers/venueType'
import { Offer } from 'shared/offer/types'
import { Separator } from 'ui/components/Separator'
import { getSpacing } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(12)

interface VenueMapBottomSheetProps extends Omit<BottomSheetProps, 'children'> {
  playlistType: PlaylistType
  onClose?: () => void
  venue?: GeolocatedVenue | null
  venueOffers?: Offer[] | null
  PlaylistContainer?: FunctionComponent
}

export const VenueMapBottomSheet = forwardRef<BottomSheetMethods, VenueMapBottomSheetProps>(
  function VenueMapBottomSheet(
    {
      onClose,
      venue,
      venueOffers,
      PlaylistContainer = Fragment,
      playlistType,
      ...bottomSheetProps
    },
    ref
  ) {
    const { userLocation, selectedPlace, selectedLocationMode } = useLocation()

    const distanceToVenue = getDistance(
      {
        lat: venue?._geoloc.lat,
        lng: venue?._geoloc.lng,
      },
      { userLocation, selectedPlace, selectedLocationMode }
    )
    const { navigate } = useNavigation<UseNavigationType>()
    const shouldUseIsOpenToPublic = useFeatureFlag(RemoteStoreFeatureFlags.WIP_IS_OPEN_TO_PUBLIC)

    const venueTags = useMemo(() => {
      if (!venue) {
        return []
      }
      const venueTypeLabel = parseType(venue?.venue_type)
      return getVenueTags({ distance: distanceToVenue, venue_type: venueTypeLabel })
    }, [venue, distanceToVenue])

    const offersPlaylist = useMemo(() => {
      if (venueOffers?.length) {
        const handlePressMore = venue ? () => navigate('Venue', { id: venue.venueId }) : undefined
        return (
          <PlaylistContainer>
            <StyledView>
              <StyledSeparator />
            </StyledView>
            <ScrollView>
              <VenueMapOfferPlaylist
                offers={venueOffers}
                onPressMore={handlePressMore}
                playlistType={playlistType}
              />
            </ScrollView>
          </PlaylistContainer>
        )
      }
      return null
    }, [venueOffers, venue, PlaylistContainer, playlistType, navigate])

    const venueMapPreview = useMemo(() => {
      if (venue) {
        const address = venue.postalCode ? `${venue.info}, ${venue.postalCode}` : venue.info
        const isOpenToPublicVenue = venue.isOpenToPublic ?? false
        const enableNavigate = shouldUseIsOpenToPublic ? isOpenToPublicVenue : venue.isPermanent

        return (
          <VenueMapPreview
            venueName={venue.label}
            onClose={onClose}
            iconSize={20}
            address={address}
            bannerUrl={venue.banner_url ?? ''}
            imageWidth={VENUE_THUMBNAIL_SIZE}
            imageHeight={VENUE_THUMBNAIL_SIZE}
            tags={venueTags}
            navigateTo={{ screen: 'Venue', params: { id: venue.venueId, from: 'venueMap' } }}
            noBorder
            testID="venueMapPreview"
            enableNavigate={enableNavigate}
            withRightArrow={enableNavigate}
            style={{ paddingHorizontal: getSpacing(4) }}
          />
        )
      }
      return null
    }, [venue, shouldUseIsOpenToPublic, onClose, venueTags])

    return (
      <StyledBottomSheet
        ref={ref}
        index={-1}
        enablePanDownToClose
        {...bottomSheetProps}
        handleComponent={HandleComponent}>
        <StyledBottomSheetView>
          {venueMapPreview}
          {offersPlaylist}
        </StyledBottomSheetView>
      </StyledBottomSheet>
    )
  }
)

const StyledBottomSheetView = styled(BottomSheetView)({
  paddingTop: getSpacing(2),
  flex: 1,
})

const StyledBottomSheet = styled(BottomSheet).attrs<VenueMapBottomSheetProps>(({ theme }) => ({
  containerStyle: { zIndex: theme.zIndex.bottomSheet },
}))``

const StyledSeparator = styled(Separator.Horizontal)({
  marginTop: getSpacing(4),
  marginBottom: getSpacing(3),
})

const StyledView = styled.View({
  paddingHorizontal: 16,
})

const HANDLE_STROKE = getSpacing(0.75)
const HANDLE_LENGTH = getSpacing(14)

const HandleComponent: FunctionComponent<BottomSheetHandleProps> = () => {
  return (
    <HandleContainer>
      <Handle />
    </HandleContainer>
  )
}

const HandleContainer = styled.View({
  alignItems: 'center',
  paddingTop: 16,
  paddingBottom: 8,
})

const Handle = styled.View(({ theme }) => ({
  width: HANDLE_LENGTH,
  height: HANDLE_STROKE,
  backgroundColor: theme.colors.greySemiDark,
}))
