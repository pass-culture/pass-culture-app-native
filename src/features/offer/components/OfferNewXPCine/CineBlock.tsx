import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { EventCardProps } from 'ui/components/eventCard/EventCard'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { Spacer } from 'ui/theme'

type Props = {
  offer: OfferResponseV2
  distance?: string
  onSeeVenuePress?: VoidFunction
  CTAOfferModal?: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | null
  eventCardData: EventCardProps[]
}
export const CineBlock: FunctionComponent<Props> = ({
  offer,
  distance,
  onSeeVenuePress,
  CTAOfferModal,
  eventCardData,
}) => {
  const theme = useTheme()

  return (
    <View>
      <Spacer.Column numberOfSpaces={6} />
      <VenueBlock distance={distance} offer={offer} onSeeVenuePress={onSeeVenuePress} />
      <Spacer.Column numberOfSpaces={4} />
      {eventCardData === undefined ? null : <EventCardList data={eventCardData} />}
      {CTAOfferModal}
      <Spacer.Column numberOfSpaces={theme.isDesktopViewport ? 6 : 4} />
      <Divider />
    </View>
  )
}

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.greyMedium,
}))
