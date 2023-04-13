import React from 'react'
import { View, ViewProps } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import styled, { useTheme } from 'styled-components/native'

import { DistanceTag } from 'features/offer/components/DistanceTag/DistanceTag'
import { mapVenueTypeToIcon, VenueTypeCode } from 'libs/parsers'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface VenueDetailsProps extends ViewProps {
  title: string
  address: string
  imageUrl?: string
  venueType: VenueTypeCode | null
  distance?: string
}

export function VenueDetails({
  title,
  imageUrl,
  address,
  venueType,
  distance,
  ...props
}: VenueDetailsProps) {
  const theme = useTheme()
  const Icon = mapVenueTypeToIcon(venueType)

  return (
    <Wrapper {...props}>
      <LeftContent>
        <View>
          <Typo.ButtonText>{title}</Typo.ButtonText>
          <Spacer.Column numberOfSpaces={1} />
          <VenueAddress>{address}</VenueAddress>
        </View>

        {distance ? (
          <React.Fragment>
            <Spacer.Flex />
            <DistanceTag distance={distance} />
          </React.Fragment>
        ) : null}
      </LeftContent>

      <Spacer.Flex />

      {imageUrl ? (
        <VenueImage testID="venue-image" url={imageUrl} resizeMode={FastImage.resizeMode?.cover} />
      ) : (
        <PlaceholderWrapper testID="image-placeholder">
          <Icon color={theme.colors.greySemiDark} size={getSpacing(12)} />
        </PlaceholderWrapper>
      )}
    </Wrapper>
  )
}

const Wrapper = styled(View)`
  flex-direction: row;
  flex-grow: 1;
`

const LeftContent = styled(View)`
  justify-content: center;
  flex-grow: 1;
  flex-shrink: 1;
`

const VenueAddress = styled(Typo.Caption).attrs({
  numberOfLines: 2,
  ellipsizeMode: 'tail',
})(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const VenueImage = styled(ResizedFastImage)`
  border-radius: ${getSpacing(1)}px;
  width: ${getSpacing(24)}px;
  height: ${getSpacing(24)}px;
`

const PlaceholderWrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.greyLight};
  border-radius: ${getSpacing(1)}px;
  width: ${getSpacing(24)}px;
  height: ${getSpacing(24)}px;
  justify-content: center;
  align-items: center;
`
