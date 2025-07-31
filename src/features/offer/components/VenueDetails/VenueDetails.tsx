import React from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { VenueDetail } from 'features/offer/types'
import { Tag } from 'ui/components/Tag/Tag'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export interface VenueDetailsProps extends VenueDetail, ViewProps {
  /**
   * This prop is for internal usage only.
   * It is used by `<VenueCard />` component and should not be used by
   * developers outside this component.
   */
  isHover?: boolean
}

enum Size {
  Small = 'smallSize',
  Large = 'largeSize',
}

export function VenueDetails({
  title,
  address,
  distance,
  isHover,
  ...props
}: Readonly<VenueDetailsProps>) {
  const height = distance ? Size.Large : Size.Small

  return (
    <Wrapper height={height} {...props}>
      <ViewGap gap={1}>
        <Title isHover={isHover}>{title}</Title>
        <VenueAddress isHover={isHover}>{address}</VenueAddress>
      </ViewGap>

      {distance ? <StyledTag label={`à ${distance}`} /> : null}
    </Wrapper>
  )
}

const Wrapper = styled(View)<{ height: Size }>((props) => ({
  justifyContent: 'center',
  flexGrow: 1,
  flexShrink: 1,
  height: props.height === Size.Large ? getSpacing(23.5) : getSpacing(14.5),
}))

const Title = styled(Typo.BodyAccent).attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.default, isHover }),
}))

const VenueAddress = styled(Typo.BodyAccentXs).attrs({
  numberOfLines: 2,
  ellipsizeMode: 'tail',
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  color: theme.designSystem.color.text.subtle,
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.subtle, isHover }),
}))

const StyledTag = styled(Tag)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
