import React, { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/native'

import LottieView from 'libs/lottie'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { AnimationObject } from 'ui/animations/type'
import { Spacer } from 'ui/components/spacer/Spacer'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'
import { TextProps } from 'ui/theme/typography'

type PropsWithAnimation = {
  animation: AnimationObject
}

type PropsWithIcon = {
  icon: React.FC<IconInterface>
}

type Props = {
  titleComponent?: React.FC<TextProps>
  subtitleComponent?: React.FC<TextProps>
  title: string
  subtitle?: string
  activeIndex?: number
} & (PropsWithAnimation | PropsWithIcon)

const SMALL_HEIGHT = 576

export const GenericInfoPageWhite: React.FC<Props> = (props) => {
  const animationRef = useRef<LottieView>(null)
  const grid = useGrid()
  const isSmallHeight = useMediaQuery({ maxHeight: SMALL_HEIGHT })
  const lottieStyle = useMemo(
    () => (isSmallHeight ? { height: '100%' } : undefined),
    [isSmallHeight]
  )

  const { animation } = props as PropsWithAnimation
  const { icon: Icon } = props as PropsWithIcon
  const titleComponent = props.titleComponent ?? Typo.Title1
  const subtitleComponent = props.subtitleComponent ?? Typo.Title4

  const StyledTitle = useMemo(() => {
    return styled(titleComponent)({
      textAlign: 'center',
    })
  }, [titleComponent])

  const StyledIcon =
    Icon &&
    styled(Icon).attrs(({ theme }) => ({
      size: theme.illustrations.sizes.fullPage,
      color: theme.colors.white,
    }))({ width: '100%' })

  const StyledSubtitle = useMemo(() => {
    return styled(subtitleComponent)({
      textAlign: 'center',
    })
  }, [subtitleComponent])

  useEffect(() => {
    if (animation && animationRef.current) {
      animationRef.current.play(0, 62)
    }
  }, [animationRef, animation])

  return (
    <Container>
      <Spacer.Flex flex={grid({ sm: 1, default: 2 }, 'height')} />
      <StyledLottieContainer>
        {animation ? (
          <StyledLottieView
            style={lottieStyle}
            key={props?.activeIndex}
            ref={animationRef}
            source={animation}
            loop={false}
          />
        ) : (
          <StyledIcon />
        )}
      </StyledLottieContainer>
      <Spacer.Flex flex={1} />
      <StyledTitle>{props.title}</StyledTitle>
      {!!props.subtitle && <StyledSubtitle>{props.subtitle}</StyledSubtitle>}
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
  overflow: 'scroll',
}))

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
