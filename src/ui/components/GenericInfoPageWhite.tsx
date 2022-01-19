import React, { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/native'

import LottieView from 'libs/lottie'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { AnimationObject } from 'ui/animations/type'
import { Spacer } from 'ui/components/spacer/Spacer'
import { getSpacing, Typo } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'

type Props = {
  animation: AnimationObject
  title: string
  subtitle?: string
  activeIndex?: number
}

const SMALL_HEIGHT = 576

export const GenericInfoPageWhite: React.FC<Props> = (props) => {
  const animationRef = useRef<LottieView>(null)
  const grid = useGrid()
  const isSmallHeight = useMediaQuery({ maxHeight: SMALL_HEIGHT })
  const lottieStyle = useMemo(
    () => (isSmallHeight ? { height: '100%' } : undefined),
    [isSmallHeight]
  )

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play(0, 62)
    }
  }, [animationRef])

  return (
    <Container>
      <Spacer.Flex flex={grid({ sm: 1, default: 2 }, 'height')} />
      <StyledLottieContainer>
        <StyledLottieView
          style={lottieStyle}
          key={props?.activeIndex}
          ref={animationRef}
          source={props.animation}
          loop={false}
        />
      </StyledLottieContainer>
      <Spacer.Flex flex={1} />
      <StyledTitle>{props.title}</StyledTitle>
      <Spacer.Flex flex={0.5} />
      {props.children}
      <Spacer.Flex flex={grid({ default: 1.5, sm: 2 }, 'height')} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  alignSelf: 'center',
  flex: 1,
  paddingHorizontal: getSpacing(5),
  maxWidth: theme.contentPage.maxWidth,
}))

const StyledTitle = styled(Typo.Title1)({
  textAlign: 'center',
})

const StyledLottieContainer = styled.View({
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  height: '30%',
})

const StyledLottieView = styled(LottieView)({
  width: '100%',
  height: '100%',
})
