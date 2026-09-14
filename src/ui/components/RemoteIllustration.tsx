// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { IllustrationColorKey } from 'theme/types'
import { ErrorServer } from 'ui/svg/ErrorServer'
import { getSpacing } from 'ui/theme'

export type RemoteIllustrationProps = {
  url: string
  backgroundColor: IllustrationColorKey
  size?: 's' | 'xl'
  testID?: string
}

export const RemoteIllustration = ({
  url,
  backgroundColor,
  size = 'xl',
  testID = 'remote-illustration',
}: RemoteIllustrationProps): React.JSX.Element => {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Container
      backgroundColor={backgroundColor}
      size={size}
      showBackground={isLoaded}
      testID="remote-illustration-container">
      {hasError ? (
        <ErrorServer testID="error-server" />
      ) : (
        <Image
          source={{ uri: url }}
          resizeMode="contain"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          testID={testID}
        />
      )}
    </Container>
  )
}

const Container = styled.View<{
  backgroundColor: IllustrationColorKey
  size: 's' | 'xl'
  showBackground: boolean
}>(({ backgroundColor, size, showBackground, theme }) => {
  const isXl = size === 'xl'

  return {
    alignItems: 'center',
    justifyContent: 'center',
    width: isXl ? theme.designSystem.size.illustration.xl : theme.designSystem.size.illustration.s,
    maxWidth: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: showBackground
      ? theme.designSystem.color.illustration[backgroundColor]
      : 'transparent',
    borderTopLeftRadius: isXl ? getSpacing(14) : theme.designSystem.size.borderRadius.xxl,
    borderBottomRightRadius: isXl ? getSpacing(14) : theme.designSystem.size.borderRadius.xxl,
    marginTop: isXl ? theme.designSystem.size.spacing.l : undefined,
  }
})

const Image = styled(FastImage)({
  width: '100%',
  height: '100%',
})
