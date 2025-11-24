import { useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import React, { FC, ReactNode } from 'react'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2, SubcategoryIdEnum, VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferCineBlock } from 'features/offer/components/OfferCine/OfferCineBlock'
import { OfferVenueContainer } from 'features/offer/components/OfferVenueContainer/OfferVenueContainer'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { analytics } from 'libs/analytics/provider'
import { QueryKeys } from 'libs/queryKeys'
import { Subcategory } from 'libs/subcategories/types'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export type OfferPlaceProps = {
  offer: OfferResponseV2
  subcategory: Subcategory
  isOfferAtSameAddressAsVenue: boolean
  distance?: string | null
}

type PartialVenue = Pick<VenueResponse, 'id' | 'name' | 'description' | 'isOpenToPublic'>

const mergeVenueData =
  (venue: PartialVenue) =>
  (prevData: VenueResponse | undefined): VenueResponse => ({
    id: venue.id,
    name: venue.name,
    // Info not available in OfferVenueResponse so we fallback to OTHER
    venueTypeCode: VenueTypeCodeKey.OTHER,
    isVirtual: false,
    description: venue.description,
    accessibility: {},
    contact: {},
    timezone: '',
    isOpenToPublic: venue.isOpenToPublic,
    ...(prevData ?? {}),
  })

export const OfferPlace: FC<OfferPlaceProps> = ({
  offer,
  subcategory,
  distance,
  isOfferAtSameAddressAsVenue,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, subcategory.isEvent)

  const isOfferAMovieScreening = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  const canSeeVenue = offer.venue.isPermanent

  const handleOnSeeVenuePress = canSeeVenue
    ? async () => {
        // We pre-populate the query-cache with the data from the search result for a smooth transition
        queryClient.setQueryData([QueryKeys.VENUE, offer.venue.id], mergeVenueData(offer.venue))
        await analytics.logConsultVenue({ venueId: offer.venue.id.toString(), from: 'offer' })
        navigate('Venue', { id: offer.venue.id })
      }
    : undefined

  return (
    <OfferPlaceWrapper isDigital={offer.isDigital}>
      {isOfferAMovieScreening ? (
        <OfferCineBlock
          title={venueSectionTitle}
          offer={offer}
          onSeeVenuePress={handleOnSeeVenuePress}
        />
      ) : (
        <OfferVenueContainer
          offer={offer}
          distance={distance}
          subcategory={subcategory}
          handleOnSeeVenuePress={handleOnSeeVenuePress}
          isOfferAtSameAddressAsVenue={isOfferAtSameAddressAsVenue}
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
