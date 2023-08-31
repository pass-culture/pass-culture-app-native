import React, { ComponentProps, FunctionComponent, useEffect, useRef } from 'react'
import { Path, Svg } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AnimatedRef, AnimatedView } from 'libs/react-native-animatable'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Clear } from 'ui/svg/icons/Clear'
import { Typo, getSpacing } from 'ui/theme'

const FADE_IN_DURATION = 300

type Props = {
  label: string
  isVisible?: boolean
  onHide?: () => void
  style?: ComponentProps<typeof AnimatedView>['style']
}

export const Tooltip: FunctionComponent<Props> = ({ label, isVisible, onHide, style }) => {
  const containerRef: AnimatedRef = useRef(null)
  useEffect(() => {
    if (isVisible) {
      containerRef.current?.fadeIn?.()
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <AnimatedView
      duration={FADE_IN_DURATION}
      style={style}
      ref={containerRef}
      accessibilityRole={AccessibilityRole.TOOLTIP}>
      <StyledPointer />
      <Background>
        <StyledText>{label}</StyledText>
        <StyledClearContainer onPress={onHide} accessibilityLabel="Fermer le tooltip">
          <StyledClearIcon />
        </StyledClearContainer>
      </Background>
    </AnimatedView>
  )
}

const Pointer = ({ style }: { style?: ComponentProps<typeof Svg>['style'] }) => {
  const theme = useTheme()
  return (
    <Svg width="12" height="6" viewBox="0 0 12 6" style={style}>
      <Path
        d="M12 6H0L5.293 0.293188C5.684 -0.0978099 6.317 -0.0978098 6.707 0.293189Z"
        fill={theme.uniqueColors.backgroundSurface}
      />
    </Svg>
  )
}
const StyledPointer = styled(Pointer)({
  position: 'relative',
  alignSelf: 'flex-end',
  right: 14,
})

const Background = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  padding: getSpacing(2),
  paddingLeft: getSpacing(4),
  borderRadius: getSpacing(2),
  backgroundColor: theme.uniqueColors.backgroundSurface,
}))

const StyledText = styled(Typo.Caption)(({ theme }) => ({
  flexShrink: 1,
  color: theme.colors.white,
}))

const StyledClearContainer = styled(TouchableOpacity)({
  marginLeft: getSpacing(2),
})

const StyledClearIcon = styled(Clear).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.smaller,
}))({})
