import React, { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { getShadow, getSpacing } from 'ui/theme'
import { AVATAR_SMALL } from 'ui/theme/constants'

const SHADOW = getShadow({
  shadowOffset: { width: 0, height: getSpacing(1) },
  shadowRadius: getSpacing(2),
  shadowColor: theme.colors.greyDark,
  shadowOpacity: 0.3,
})

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
  backgroundColor = 'white',
  borderColor = 'white',
  borderWidth = 0,
  rounded = true,
  borderRadius,
  children,
}: PropsWithChildren<AvatarProps>) => {
  const ContainerComponent = (
    <Container
      rounded={rounded}
      size={size}
      testID="Avatar"
      borderWidth={borderWidth}
      borderColor={borderColor}
      borderRadius={borderRadius}>
      <AvatarBody size={size} backgroundColor={backgroundColor} borderWidth={borderWidth}>
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

const ShadowWrapper = styled.View(SHADOW)

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
>(({ size = AVATAR_SMALL, rounded, borderColor, borderWidth, borderRadius }) => ({
  width: size,
  height: size,
  overflow: 'hidden',
  borderWidth,
  borderColor,
  borderRadius: borderRadius ?? (rounded ? size * 0.5 : 0),

  ...(Platform.OS === 'ios' ? undefined : SHADOW),
}))
