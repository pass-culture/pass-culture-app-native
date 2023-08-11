import React from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { DistanceTag } from 'features/offer/components/DistanceTag/DistanceTag'
import { VenueDetail } from 'features/offer/types'
import { Spacer, Typo } from 'ui/theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export interface VenueDetailsProps extends VenueDetail, ViewProps {
  /**
   * This prop is for internal usage only.
   * It is used by `<VenueCard />` component and should not be used by
   * developers outside this component.
   */
  isHover?: boolean
}

export function VenueDetails({ title, address, distance, isHover, ...props }: VenueDetailsProps) {
  return (
    <Wrapper {...props}>
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
    </Wrapper>
  )
}

const Wrapper = styled(View)({
  justifyContent: 'center',
  flexGrow: 1,
  flexShrink: 1,
})

const Title = styled(Typo.ButtonText).attrs({
  numberOfLines: 1,
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
