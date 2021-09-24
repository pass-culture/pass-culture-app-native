import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { VenueResponse, VenueTypeCode } from 'api/gen'
import { VenueCaption } from 'features/home/atoms/VenueCaption'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { accessibilityAndTestId } from 'tests/utils'
import { ImageTile } from 'ui/components/ImageTile'
import { ColorsEnum, RATIO_HOME_IMAGE } from 'ui/theme'
import { BorderRadiusEnum, LENGTH_S } from 'ui/theme/grid'

interface VenueTileProps {
  venueId: number
  name: string
  venueType: VenueTypeCode
  distance?: string
  description?: string
}

type PartialVenue = Pick<VenueTileProps, 'venueType' | 'name' | 'venueId' | 'description'>

export const mergeVenueData = (venue: PartialVenue) => (
  prevData: VenueResponse | undefined
): VenueResponse => ({
  id: venue.venueId,
  name: venue.name,
  venueTypeCode: venue.venueType,
  isVirtual: false,
  description: venue.description,
  accessibility: {},
  contact: {},
  ...(prevData || {}),
})

const imageHeight = LENGTH_S
const imageWidth = imageHeight * 2.25 * RATIO_HOME_IMAGE
// TODO (Lucasbeneston) : Remove when we get image from venue
const uri =
  'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA'

export const VenueTile = (props: VenueTileProps) => {
  const { venueId, name, distance, venueType } = props
  const navigation = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()

  function handlePressVenue() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData(['venue', venueId], mergeVenueData(props))
    analytics.logConsultVenue({ venueId, from: 'home' })
    navigation.navigate('Venue', {
      id: venueId,
    })
  }

  return (
    <Container>
      <TouchableHighlight
        imageHeight={imageHeight}
        imageWidth={imageWidth}
        onPress={handlePressVenue}
        {...accessibilityAndTestId('venueTile')}>
        <ImageTile imageWidth={imageWidth} imageHeight={imageHeight} uri={uri} />
      </TouchableHighlight>
      <VenueCaption imageWidth={imageWidth} name={name} venueType={venueType} distance={distance} />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })

const TouchableHighlight = styled.TouchableHighlight<{ imageHeight: number; imageWidth: number }>(
  ({ imageHeight, imageWidth }) => ({
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight,
    width: imageWidth,
    backgroundColor: ColorsEnum.GREY_DISABLED,
  })
)
