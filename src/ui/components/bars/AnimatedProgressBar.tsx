import React, { FunctionComponent, memo, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AnimatedView } from 'libs/react-native-animatable'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { UniqueColors, ColorsEnum } from 'ui/theme/colors'

interface ProgressBarProps {
  progress: number
  color: ColorsEnum | UniqueColors
  icon: FunctionComponent<IconInterface>
  isAnimated?: boolean
  children?: never
}

const AnimatedProgressBarComponent: React.FC<ProgressBarProps> = ({
  color,
  progress,
  icon: Icon,
  isAnimated = false,
}) => {
  const barRef = useRef<AnimatedView & View>(null)
  const [barWidth, setBarWidth] = useState(0)

  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.white,
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
  return (
    <Container>
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
          useNativeDriver
          duration={1000}
          easing={'ease-in-out'}
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
  borderRadius: 32,
  backgroundColor,
  zIndex: theme.zIndex.progressbarIcon,
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
}))

const ProgressBarContainer = styled.View(({ theme }) => ({
  marginLeft: getSpacing(5),
  flexDirection: 'row',
  overflow: 'hidden',
  flex: 1,
  borderWidth: 2,
  borderColor: theme.colors.greyMedium,
  borderRadius: 20,
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
