import React, { PropsWithChildren } from 'react'
import styled, { useTheme } from 'styled-components/native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { AVATAR_SMALL } from 'ui/theme/constants'

export type AvatarProps = {
  size?: number
  backgroundColor?: string
  rounded?: boolean
  borderRadius?: number
}

export const Avatar = ({
  size = AVATAR_SMALL,
  backgroundColor,
  rounded = true,
  borderRadius,
  children,
}: PropsWithChildren<AvatarProps>) => {
  const { designSystem } = useTheme()
  const backgroundColorFromTheme = backgroundColor ?? designSystem.color.background.default

  return (
    <Container rounded={rounded} size={size} testID="Avatar" borderRadius={borderRadius}>
      <AvatarBody size={size} backgroundColor={backgroundColorFromTheme}>
        {children}
      </AvatarBody>
    </Container>
  )
}

const AvatarBody = styled.View<Pick<AvatarProps, 'size' | 'backgroundColor'>>(
  ({ size, backgroundColor }) => ({
    width: size,
    height: size,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  })
)

const Container = styled.View<Pick<AvatarProps, 'rounded' | 'size' | 'borderRadius'>>(
  ({ size = AVATAR_SMALL, rounded, borderRadius }) => ({
    width: size,
    height: size,
    overflow: 'hidden',
    borderRadius: borderRadius ?? (rounded ? size * 0.5 : 0),
  })
)
