import React from 'react'
import styled from 'styled-components/native'

import { BookingItemProps } from 'features/bookings/types'
import { Image } from 'react-native'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Dot } from 'ui/svg/icons/Dot'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
import { BookingItemTitle } from './BookingItemTitle'

export const EndedRideBookingItem = ({ booking }: BookingItemProps) => {
  return (
    <Container navigateTo={{ screen: 'RideDetails', params: { booking } }}>
      <StyledImage
        source={require('./../components/assets/Images/carbooking.png')}
        resizeMode="contain"
      />

      <AttributesView>
        <BookingItemTitle title={booking?.name || 'Alliance Taxi'} />
        <LocationContainer>
          <StyledLocationIcon
            resizeMode="contain"
            source={require('./../components/assets/Icons/blueLocationPin.png')}
          />
          <Spacer.Row numberOfSpaces={1} />
          <DateLabel numberOfLines={1} >{booking?.source?.name}</DateLabel>
        </LocationContainer>
        <DotCoontainer>
          <Dot size={2} fillColor={ColorsEnum.GREY_MEDIUM} />
          <Dot size={2} fillColor={ColorsEnum.GREY_MEDIUM} />
          <Dot size={2} fillColor={ColorsEnum.GREY_MEDIUM} />
        </DotCoontainer>
        <LocationContainer>
          <StyledLocationIcon
            resizeMode="contain"
            source={require('./../components/assets/Icons/redLocationPin.png')}
          />
          <Spacer.Row numberOfSpaces={1} />
          <DateLabel numberOfLines={1} >{booking?.destination?.name}</DateLabel>
        </LocationContainer>
        <Spacer.Flex />
      </AttributesView>
    </Container>
  )
}

const Container = styled(InternalTouchableLink)({
  //   paddingHorizontal: getSpacing(6),
  flexDirection: 'row',
})

const AttributesView = styled.View({
  flex: 1,
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(1),
})

const StyledImage = styled(Image)(({ theme, size }) => ({
  backgroundColor: theme.colors.greyLight,
  ...theme.tiles.sizes.small,
  borderRadius: theme.tiles.borderRadius,
}))

const StyledLocationIcon = styled(Image)({
  height: 14,
  width: 12,
})

const LocationContainer = styled.View({
  //   flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
const DotCoontainer = styled.View({
  flex: 1,
  width: 11,
  alignItems: 'center',
  justifyContent: 'space-around',
})

const DateLabel = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
