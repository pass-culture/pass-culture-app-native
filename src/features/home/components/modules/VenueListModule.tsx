import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { VenueHit } from 'libs/algolia/types'
import { Position, useLocation } from 'libs/location'
import { formatDistance } from 'libs/parsers/formatDistance'
import { Separator } from 'ui/components/Separator'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const IMAGE_SIZE = 72

const ListHeaderComponent = () => (
  <React.Fragment>
    <StyledTouchableHeader navigateTo={{ screen: 'VenueMap' }}>
      <Typo.Caption>{'Les lieux culturels à proximité'.toUpperCase()}</Typo.Caption>
      <ArrowRightIcon />
    </StyledTouchableHeader>
    <Spacer.Column numberOfSpaces={4} />
  </React.Fragment>
)

const renderItem = ({ item }: { item: VenueHit }, userLocation: Position) => {
  const distance = formatDistance({ lat: item.latitude, lng: item.longitude }, userLocation)
  const address = [item.city, item.postalCode].filter(Boolean).join(', ')
  return (
    <InternalTouchableLink navigateTo={{ screen: 'Venue', params: { id: item.id } }}>
      <VenuePreview
        address={address}
        venueName={item.name}
        imageHeight={IMAGE_SIZE}
        imageWidth={IMAGE_SIZE}
        bannerUrl={item.bannerUrl}>
        {distance ? <StyledTag label={distance} /> : null}
      </VenuePreview>
    </InternalTouchableLink>
  )
}

const keyExtractor: (item: VenueHit) => string = (item) => item.id.toString()

type Props = {
  venues: VenueHit[]
}

export const VenueListModule: FunctionComponent<Props> = ({ venues }) => {
  const { userLocation } = useLocation()

  return (
    <StyledFlatList
      listAs="ul"
      itemAs="li"
      data={venues}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => renderItem({ item }, userLocation)}
      ItemSeparatorComponent={HorizontalSeparator}
      ListHeaderComponent={ListHeaderComponent}
    />
  )
}

const StyledFlatList = styled(FlatList as typeof FlatList<VenueHit>)(({ theme }) => ({
  backgroundColor: theme.colors.goldLight100,
  borderRadius: getSpacing(4),
  padding: getSpacing(4),
}))

const StyledTouchableHeader = styled(InternalTouchableLink)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: getSpacing(2),
})

const StyledTag = styled(Tag)(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const HorizontalSeparator: FunctionComponent = () => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={4} />
    <StyledSeparator />
    <Spacer.Column numberOfSpaces={4} />
  </React.Fragment>
)

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))({})
