import { useFocusEffect } from '@react-navigation/native'
import React, { ComponentProps, FunctionComponent, useCallback, useEffect, useRef } from 'react'
import { Path, Svg } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AnimatedRef, AnimatedView } from 'libs/react-native-animatable'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { useEscapeKeyAction } from 'ui/hooks/useEscapeKeyAction'
import { Clear } from 'ui/svg/icons/Clear'
import { Typo, getSpacing } from 'ui/theme'

const FADE_IN_DURATION = 300

type Props = {
  label: string
  isVisible?: boolean
  pointerDirection?: 'top' | 'bottom'
  onHide?: () => void
  onCloseIconPress?: () => void
  style?: ComponentProps<typeof AnimatedView>['style']
}

export const Tooltip: FunctionComponent<Props> = ({
  label,
  isVisible,
  pointerDirection = 'top',
  onHide,
  onCloseIconPress,
  style,
}) => {
  const containerRef: AnimatedRef = useRef(null)
  useEffect(() => {
    if (isVisible) {
      containerRef.current?.fadeIn?.()
    }
  }, [isVisible])

  // Hide tooltip when navigating away
  useFocusEffect(
    useCallback(() => {
      return () => onHide?.()
    }, [onHide])
  )

  // For a11y reason, hide tooltip when pressing escape key
  useEscapeKeyAction(isVisible ? onCloseIconPress || onHide : undefined)

  if (!isVisible) return null

  return (
    <StyledAnimatedView
      duration={FADE_IN_DURATION}
      style={style}
      ref={containerRef}
      accessibilityRole={AccessibilityRole.TOOLTIP}
      pointerDirection={pointerDirection}>
      <StyledPointer pointerDirection={pointerDirection} />
      <Background>
        <StyledText>{label}</StyledText>
        <StyledClearContainer
          onPress={onCloseIconPress || onHide}
          accessibilityLabel="Fermer le tooltip">
          <StyledClearIcon />
        </StyledClearContainer>
      </Background>
    </StyledAnimatedView>
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

const StyledPointer = styled(Pointer)<Pick<Props, 'pointerDirection'>>(({ pointerDirection }) => ({
  position: 'relative',
  alignSelf: 'flex-end',
  right: getSpacing(3.5),
  transform: pointerDirection === 'bottom' ? 'rotate(180deg)' : undefined,
}))

const StyledAnimatedView = styled(AnimatedView)<Pick<Props, 'pointerDirection'>>(
  ({ pointerDirection }) => ({
    flexDirection: pointerDirection === 'bottom' ? 'column-reverse' : 'column',
  })
)

const Background = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-start',
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

const StyledClearContainer = styledButton(Touchable)({
  marginLeft: getSpacing(2),
  flexShrink: 1,
})

const StyledClearIcon = styled(Clear).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.smaller,
}))({})
