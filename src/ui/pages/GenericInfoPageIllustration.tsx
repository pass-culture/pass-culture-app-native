// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import React from 'react'
import styled from 'styled-components/native'

import { IllustrationColorKey } from 'theme/types'
import { getSpacing } from 'ui/theme'

export type RemoteIllustration = {
  url: string
  backgroundColor: IllustrationColorKey
}

export const GenericInfoPageIllustration = ({
  url,
  backgroundColor,
}: RemoteIllustration): React.JSX.Element => (
  <Container
    illustrationBackgroundColor={backgroundColor}
    testID="generic-info-page-remote-illustration">
    <RemoteIllustration source={{ uri: url }} resizeMode="contain" />
  </Container>
)

const Container = styled.View<{
  illustrationBackgroundColor: IllustrationColorKey
}>(({ illustrationBackgroundColor, theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.designSystem.size.illustration.xl,
  maxWidth: '100%',
  aspectRatio: 1,
  overflow: 'hidden',
  backgroundColor: theme.designSystem.color.illustration[illustrationBackgroundColor],
  borderTopLeftRadius: getSpacing(14),
  borderBottomRightRadius: getSpacing(14),
  marginTop: theme.designSystem.size.spacing.l,
}))

const RemoteIllustration = styled(FastImage)({
  width: '100%',
  height: '100%',
})
