import React from 'react'
import styled from 'styled-components/native'

import { BookingItemProps } from 'features/bookings/types'
import { Image } from 'react-native'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Dot } from 'ui/svg/icons/Dot'
import { Spacer, Typo, getShadow, getSpacing } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
import { BookingItemTitle } from './BookingItemTitle'
import { Platform } from 'react-native'
type SizeProps = {
  size?: 'small' | 'tall'
}
export const EndedRideBookingItem = ({ booking }: BookingItemProps) => {
  return (
    <Container navigateTo={{ screen: 'RideDetails', params: { booking } }}>
      <ImageContainer size={'size'}>
        <StyledImage
          source={require('./../components/assets/Images/carbooking.png')}
          resizeMode="contain"
        />
      </ImageContainer>

      <AttributesView>
        <BookingItemTitle title={booking?.name || 'Alpha Taxi'} />
        <LocationContainer>
          <StyledLocationIcon
            resizeMode="contain"
            source={require('./../components/assets/Icons/blueLocationPin.png')}
          />
          <Spacer.Row numberOfSpaces={1} />
          <DateLabel>{booking?.source?.name}</DateLabel>
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
          <DateLabel>{booking?.destination?.name}</DateLabel>
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

const StyledImage = styled(Image).attrs<SizeProps>(({ theme, size }) => ({
  ...(size === 'small' ? theme.tiles.sizes.small : theme.tiles.sizes.tall),
}))<SizeProps>(({ theme, size }) => ({
  backgroundColor: theme.colors.greyLight,
  ...(size === 'small' ? theme.tiles.sizes.small : theme.tiles.sizes.tall),
  borderRadius: theme.tiles.borderRadius,
}))

const ImageContainer = styled.View<SizeProps>(({ theme, size }) => ({
  borderRadius: theme.tiles.borderRadius,
  ...(size === 'small' ? theme.tiles.sizes.small : theme.tiles.sizes.tall),
  ...(Platform.OS !== 'web'
    ? getShadow({
        shadowOffset: { width: 0, height: getSpacing(1) },
        shadowRadius: getSpacing(1),
        shadowColor: theme.colors.greyDark,
        shadowOpacity: 0.2,
      })
    : {}),
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
