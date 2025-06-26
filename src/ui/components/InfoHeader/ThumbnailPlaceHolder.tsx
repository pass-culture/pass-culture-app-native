import React, { ReactNode } from 'react'
import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { All } from 'ui/svg/icons/venueAndCategories/All'

const ThumbnailPlaceholderContainer = styled.View<{ height: number; width: number }>(
  ({ theme, height, width }) => ({
    borderRadius: theme.borderRadius.radius,
    height,
    width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.designSystem.color.background.subtle,
  })
)

const ThumbnailPlaceholderIcon = styled(All).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``

type ThumbnailPlaceholderProps = ViewProps & {
  height: number
  width: number
  icon?: ReactNode
}

export const ThumbnailPlaceholder = ({
  height,
  width,
  icon,
  ...props
}: ThumbnailPlaceholderProps) => (
  <ThumbnailPlaceholderContainer height={height} width={width} {...props}>
    {icon ?? <ThumbnailPlaceholderIcon testID="ThumbnailPlaceholderIcon" />}
  </ThumbnailPlaceholderContainer>
)
