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
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export interface VenueDetailsProps extends ViewProps {
  title: string
  address: string
  imageUrl?: string
  venueType: VenueTypeCode | null
  distance?: string
  isHover?: boolean
}

export function VenueDetails({
  title,
  imageUrl,
  address,
  venueType,
  distance,
  isHover,
  ...props
}: VenueDetailsProps) {
  const theme = useTheme()
  const Icon = mapVenueTypeToIcon(venueType)

  return (
    <Wrapper {...props}>
      <LeftContent>
        <View>
          <Title isHover={isHover}>{title}</Title>
          <Spacer.Column numberOfSpaces={1} />
          <VenueAddress isHover={isHover}>{address}</VenueAddress>
        </View>

        {distance ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
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

const Wrapper = styled(View)({
  flexDirection: 'row',
  flexGrow: 1,
  gap: getSpacing(2),
})

const LeftContent = styled.View({
  justifyContent: 'center',
  flexGrow: 1,
  flexShrink: 1,
})

const Title = styled(Typo.ButtonText).attrs({
  numberOfLines: 2,
  ellipsizeMode: 'tail',
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  ...getHoverStyle(theme.colors.black, isHover),
}))

const VenueAddress = styled(Typo.Caption).attrs({
  numberOfLines: 2,
  ellipsizeMode: 'tail',
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  color: theme.colors.greyDark,
  ...getHoverStyle(theme.colors.black, isHover),
}))

const VenueImage = styled(ResizedFastImage)({
  borderRadius: getSpacing(1),
  width: getSpacing(29),
  height: getSpacing(29),
})

const PlaceholderWrapper = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  borderRadius: getSpacing(1),
  width: getSpacing(29),
  height: getSpacing(29),
  justifyContent: 'center',
  alignItems: 'center',
}))
