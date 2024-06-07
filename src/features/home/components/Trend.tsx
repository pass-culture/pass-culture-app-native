import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { TrendBlock } from 'features/home/types'
import { ContentTypes } from 'libs/contentful/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Typo } from 'ui/theme'

const DESKTOP_BUTTON_SIZE = getSpacing(20)
const MOBILE_BUTTON_SIZE = getSpacing(14)

export const Trend = ({ image, title, homeEntryId, type }: TrendBlock) => {
  const navigateTo =
    type === ContentTypes.VENUE_MAP_BLOCK && Platform.OS !== 'web'
      ? { screen: 'VenueMap' }
      : { screen: 'ThematicHome', params: { homeId: homeEntryId } }

  return (
    <Item key={title} navigateTo={navigateTo}>
      <ItemIcon source={image} />
      <StyledText>{title}</StyledText>
    </Item>
  )
}

const Item = styled(InternalTouchableLink)(({ theme }) => ({
  gap: getSpacing(2),
  padding: theme.isDesktopViewport ? getSpacing(1.5) : getSpacing(0.75),
  alignItems: 'center',
}))

const StyledText = styled(Typo.Caption).attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  textAlign: 'center',
  width: theme.isDesktopViewport ? getSpacing(29) : getSpacing(19),
}))

const ItemIcon = styled.Image(({ theme }) => ({
  width: theme.isDesktopViewport ? DESKTOP_BUTTON_SIZE : MOBILE_BUTTON_SIZE,
  height: theme.isDesktopViewport ? DESKTOP_BUTTON_SIZE : MOBILE_BUTTON_SIZE,
}))
