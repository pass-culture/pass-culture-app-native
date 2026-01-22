import React, { FunctionComponent, memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AnimatedView, AnimatedViewRefType } from 'libs/react-native-animatable'
import { ColorsType } from 'theme/types'
import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'
import { AccessibleIcon } from 'ui/svg/icons/types'

interface ProgressBarProps {
  progress: number
  color: ColorsType
  icon: FunctionComponent<AccessibleIcon>
  isAnimated?: boolean
  children?: never
}

const AnimatedProgressBarComponent: React.FC<ProgressBarProps> = ({
  color,
  progress,
  icon: Icon,
  isAnimated = false,
}) => {
  const barRef = useRef<AnimatedViewRefType>(null)
  const [barWidth, setBarWidth] = useState(0)

  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.designSystem.color.icon.inverted,
    size: theme.icons.sizes.smaller,
  }))``

  useEffect(() => {
    if (barRef.current && barWidth && isAnimated) {
      barRef.current.transition(
        {
          transform: [
            {
              translateX: 0,
            },
          ],
        },
        {
          transform: [
            {
              translateX: barWidth * progress,
            },
          ],
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, barRef, barWidth])

  const progressString = `${Math.round(progress * 100)}`

  return (
    <Container
      accessibilityLabel={`Barre de progression\u00a0: ${progressString}%`}
      accessibilityRole={AccessibilityRole.PROGRESSBAR}
      accessible>
      <IconContainer backgroundColor={color}>
        <StyledIcon testID="progress-bar-icon" />
      </IconContainer>
      <ProgressBarContainer>
        <Bar
          ref={barRef}
          onLayout={({
            nativeEvent: {
              layout: { width },
            },
          }) => setBarWidth(width)}
          isAnimated={isAnimated}
          progress={progress}
          backgroundColor={color}
          barWidth={barWidth}
          testID="animated-progress-bar"
          useNativeDriver={ANIMATION_USE_NATIVE_DRIVER}
          duration={1000}
          easing="ease-in-out"
        />
      </ProgressBarContainer>
    </Container>
  )
}

export const AnimatedProgressBar = memo(AnimatedProgressBarComponent)

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  height: 40,
  maxHeight: 40,
})

const IconContainer = styled.View<{ backgroundColor: string }>(({ backgroundColor, theme }) => ({
  width: 32,
  height: 32,
  borderRadius: theme.designSystem.size.borderRadius.xxl,
  backgroundColor,
  zIndex: theme.zIndex.progressbarIcon,
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
}))

const ProgressBarContainer = styled.View(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xl,
  flexDirection: 'row',
  overflow: 'hidden',
  flex: 1,
  borderWidth: 2,
  borderColor: theme.designSystem.color.border.subtle,
  borderRadius: theme.designSystem.size.borderRadius.xl,
  height: 20,
  zIndex: theme.zIndex.progressbar,
  position: 'relative',
}))

const Bar = styled(AnimatedView)<{
  backgroundColor: string
  progress: number
  isAnimated: boolean
  barWidth: number
}>(({ backgroundColor, progress, isAnimated, barWidth }) => ({
  backgroundColor,
  flex: isAnimated ? 1 : progress,
  position: 'relative',
  left: isAnimated ? -barWidth : 0,
  opacity: !isAnimated || barWidth ? 1 : 0,
}))
