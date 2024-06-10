import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { TrendBlock } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Typo } from 'ui/theme'

type TrendProps = TrendBlock & { moduleId: string }

const DESKTOP_BUTTON_SIZE = getSpacing(20)
const MOBILE_BUTTON_SIZE = getSpacing(14)

export const Trend = ({ image, title, homeEntryId, type, moduleId }: TrendProps) => {
  const navigationProps =
    type === ContentTypes.VENUE_MAP_BLOCK && Platform.OS !== 'web'
      ? {
          navigateTo: { screen: 'VenueMap' },
          onBeforeNavigate: () => analytics.logConsultVenueMap({ from: 'trend_block' }),
        }
      : {
          navigateTo: {
            screen: 'ThematicHome',
            params: { homeId: homeEntryId, moduleId, from: 'trend_block' },
          },
        }

  return (
    <Item key={title} {...navigationProps}>
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
