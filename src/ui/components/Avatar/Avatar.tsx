import React, { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { getShadow } from 'ui/theme'
import { AVATAR_SMALL } from 'ui/theme/constants'

export type AvatarProps = {
  size?: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  rounded?: boolean
  borderRadius?: number
}

export const Avatar = ({
  size = AVATAR_SMALL,
  backgroundColor,
  borderColor,
  borderWidth = 0,
  rounded = true,
  borderRadius,
  children,
}: PropsWithChildren<AvatarProps>) => {
  const { designSystem } = useTheme()
  const backgroundColorFromTheme = backgroundColor ?? designSystem.color.background.default
  const borderColorFromTheme = borderColor ?? designSystem.color.border.inverted

  const ContainerComponent = (
    <Container
      rounded={rounded}
      size={size}
      testID="Avatar"
      borderWidth={borderWidth}
      borderColor={borderColorFromTheme}
      borderRadius={borderRadius}>
      <AvatarBody size={size} backgroundColor={backgroundColorFromTheme} borderWidth={borderWidth}>
        {children}
      </AvatarBody>
    </Container>
  )

  if (Platform.OS === 'ios') {
    // Fix for iOS wich crop shadows when container has "overflow:hidden"
    return <ShadowWrapper>{ContainerComponent}</ShadowWrapper>
  }
  return ContainerComponent
}

const ShadowWrapper = styled.View(({ theme }) => ({
  ...getShadow(theme),
}))

const AvatarBody = styled.View<Pick<AvatarProps, 'size' | 'backgroundColor' | 'borderWidth'>>(
  ({ size, backgroundColor, borderWidth = 0 }) => ({
    width: size,
    height: size,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -borderWidth,
    left: -borderWidth,
  })
)

const Container = styled.View<
  Pick<AvatarProps, 'rounded' | 'size' | 'borderWidth' | 'borderColor' | 'borderRadius'>
>(({ size = AVATAR_SMALL, rounded, borderColor, borderWidth, borderRadius, theme }) => ({
  width: size,
  height: size,
  overflow: 'hidden',
  borderWidth,
  borderColor,
  borderRadius: borderRadius ?? (rounded ? size * 0.5 : 0),

  ...(Platform.OS === 'ios' ? {} : getShadow(theme)),
}))
