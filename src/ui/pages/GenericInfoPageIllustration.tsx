// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import React from 'react'
import styled from 'styled-components/native'

import { IllustrationColorKey } from 'theme/types'

export type GenericInfoPageIllustrationSize = 'default' | 'small'

export type GenericInfoPageIllustrationProps = {
  url: string
  backgroundColor: IllustrationColorKey
  size: GenericInfoPageIllustrationSize
}

const ILLUSTRATION_SIZES = {
  default: 320,
  small: 200,
} as const satisfies Record<GenericInfoPageIllustrationSize, number>

const ILLUSTRATION_BORDER_RADII = {
  default: 96,
  small: 56,
} as const satisfies Record<GenericInfoPageIllustrationSize, number>

export const GenericInfoPageIllustration = ({
  url,
  backgroundColor,
  size,
}: GenericInfoPageIllustrationProps): React.JSX.Element => (
  <Container
    cropRadius={ILLUSTRATION_BORDER_RADII[size]}
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
