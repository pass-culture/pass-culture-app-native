import { useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import React, { FC, ReactNode } from 'react'
import { useTheme } from 'styled-components/native'

import { Activity, OfferResponse, SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { OfferCineBlock } from 'features/offer/components/OfferCine/OfferCineBlock'
import { OfferCineBlockV2 } from 'features/offer/components/OfferCine/OfferCineBlockV2'
import { OfferVenueContainer } from 'features/offer/components/OfferVenueContainer/OfferVenueContainer'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'
import { Subcategory } from 'libs/subcategories/types'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export type OfferPlaceProps = {
  offer: OfferResponse
  subcategory: Subcategory
  isOfferAtSameAddressAsVenue: boolean
  distance?: string | null
  proAdvicesOnOfferSegment?: string
  proAdvicesOnVenueSegment?: string
}

type PartialVenue = Pick<
  VenueResponse,
  'id' | 'name' | 'description' | 'isOpenToPublic' | 'isPermanent'
>

const mergeVenueData =
  (venue: PartialVenue) =>
  (prevData: VenueResponse | undefined): VenueResponse => ({
    id: venue.id,
    name: venue.name,
    // Info not available in OfferVenueResponse so we fallback to OTHER
    activity: Activity.OTHER,
    description: venue.description,
    accessibilityData: {},
    timezone: '',
    isOpenToPublic: venue.isOpenToPublic,
    isPermanent: venue.isPermanent,
    ...prevData,
  })

export const OfferPlace: FC<OfferPlaceProps> = ({
  offer,
  subcategory,
  distance,
  isOfferAtSameAddressAsVenue,
  proAdvicesOnOfferSegment,
  proAdvicesOnVenueSegment,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { user } = useAuthContext()
  const queryClient = useQueryClient()
  const wipUseMovieScreeningEndpoint = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_USE_MOVIE_SCREENINGS_ENDPOINT
  )

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, subcategory.isEvent)

  const isOfferAMovieScreening = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  const handleOnSeeVenuePress = offer.venue.isPermanent
    ? async () => {
        // We pre-populate the query-cache with the data from the search result for a smooth transition
        queryClient.setQueryData([QueryKeys.VENUE, offer.venue.id], mergeVenueData(offer.venue))
        await analytics.logConsultVenue({
          venueId: offer.venue.id.toString(),
          from: 'offer',
          displayAdvice: proAdvicesOnVenueSegment === 'A',
        })
        navigate('Venue', { id: offer.venue.id })
      }
    : undefined
  const { id: offerId, extraData: offerExtraData, venue: offerVenue } = offer
  const { allocineId, visa } = offerExtraData || { allocineId: null, visa: null }
  const { coordinates } = offerVenue
  const { latitude: offerVenueLatitude, longitude: offerVenueLongitude } = coordinates
  const offerCineBlock =
    wipUseMovieScreeningEndpoint && (!!allocineId || !!visa) && !user ? (
      <OfferCineBlockV2
        title={venueSectionTitle}
        offerId={offerId}
        allocineId={allocineId?.toString()}
        visa={visa}
        offerVenueLatitude={offerVenueLatitude}
        offerVenueLongitude={offerVenueLongitude}
        onSeeVenuePress={handleOnSeeVenuePress}
      />
    ) : (
      <OfferCineBlock
        title={venueSectionTitle}
        offer={offer}
        onSeeVenuePress={handleOnSeeVenuePress}
      />
    )

  return (
    <OfferPlaceWrapper isDigital={offer.isDigital}>
      {isOfferAMovieScreening ? (
        offerCineBlock
      ) : (
        <OfferVenueContainer
          offer={offer}
          distance={distance}
          subcategory={subcategory}
          handleOnSeeVenuePress={handleOnSeeVenuePress}
          isOfferAtSameAddressAsVenue={isOfferAtSameAddressAsVenue}
          proAdvicesSegment={proAdvicesOnOfferSegment}
        />
      )}
    </OfferPlaceWrapper>
  )
}

const OfferPlaceWrapper: FC<{ isDigital: boolean; children: ReactNode }> = ({
  isDigital,
  children,
}) => {
  const { isDesktopViewport } = useTheme()

  return !isDigital && isDesktopViewport ? (
    <ViewGap gap={8} testID="place-container-without-divider">
      {children}
    </ViewGap>
  ) : (
    <SectionWithDivider visible={!isDigital} testID="place-container-with-divider" gap={8}>
      {children}
    </SectionWithDivider>
  )
}
