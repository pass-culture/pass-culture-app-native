import React, { Fragment, PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

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
}
export const Avatar = ({
  size = AVATAR_SMALL,
  backgroundColor = 'white',
  borderColor = 'white',
  borderWidth = 0,
  rounded = true,
  children,
}: PropsWithChildren<AvatarProps>) => {
  // Fix for iOS wich crop shadows when container has "overflow:hidden"
  const Wrapper = Platform.OS === 'ios' ? ShadowWrapper : Fragment
  return (
    <Wrapper>
      <Container rounded={rounded} size={size} borderWidth={borderWidth} borderColor={borderColor}>
        <AvatarBody size={size} backgroundColor={backgroundColor} borderWidth={borderWidth}>
          {children}
        </AvatarBody>
      </Container>
    </Wrapper>
  )
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
  Pick<AvatarProps, 'rounded' | 'size' | 'borderWidth' | 'borderColor'>
>(({ size = AVATAR_SMALL, rounded, borderColor, borderWidth }) => ({
  width: size,
  height: size,
  overflow: 'hidden',
  borderWidth,
  borderColor,
  borderRadius: rounded ? size * 0.5 : 0,

  ...(Platform.OS === 'ios' ? undefined : SHADOW),
}))
