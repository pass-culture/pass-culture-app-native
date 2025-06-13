import React, { ReactNode } from 'react'
import { ViewProps } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { All } from 'ui/svg/icons/venueAndCategories/All'

const ThumbnailPlaceholderContainer = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.greyLight, theme.colors.greyMedium],
}))<{ height: number; width: number }>(({ theme, height, width }) => ({
  borderRadius: theme.borderRadius.radius,
  height,
  width,
  alignItems: 'center',
  justifyContent: 'center',
}))

const ThumbnailPlaceholderIcon = styled(All).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
  color: theme.colors.greyMedium,
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
