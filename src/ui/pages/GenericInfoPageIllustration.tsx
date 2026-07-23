// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import React from 'react'
import styled from 'styled-components/native'

import { IllustrationColorKey } from 'theme/types'

type RemoteIllustrationSize = 'default' | 'small'

export type RemoteIllustration = {
  url: string
  backgroundColor: IllustrationColorKey
  size: RemoteIllustrationSize
}

const ILLUSTRATION_SIZES = {
  default: 320,
  small: 200,
} as const satisfies Record<RemoteIllustrationSize, number>

const ILLUSTRATION_BORDER_RADIUS = {
  default: 96,
  small: 56,
} as const satisfies Record<RemoteIllustrationSize, number>

export const GenericInfoPageIllustration = ({
  url,
  backgroundColor,
  size,
}: RemoteIllustration): React.JSX.Element => (
  <Container
    cropRadius={ILLUSTRATION_BORDER_RADIUS[size]}
    illustrationBackgroundColor={backgroundColor}
    illustrationSize={ILLUSTRATION_SIZES[size]}
    testID="generic-info-page-remote-illustration">
    <RemoteIllustration source={{ uri: url }} resizeMode="contain" />
  </Container>
)

const Container = styled.View<{
  cropRadius: number
  illustrationBackgroundColor: IllustrationColorKey
  illustrationSize: number
}>(({ cropRadius, illustrationBackgroundColor, illustrationSize, theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: illustrationSize,
  maxWidth: '100%',
  aspectRatio: 1,
  overflow: 'hidden',
  backgroundColor: theme.designSystem.color.illustration[illustrationBackgroundColor],
  borderTopLeftRadius: cropRadius,
  borderBottomRightRadius: cropRadius,
}))

const RemoteIllustration = styled(FastImage)({
  width: '100%',
  height: '100%',
})
