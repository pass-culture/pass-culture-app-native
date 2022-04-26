import React, { ReactNode, useEffect, useMemo, useRef } from 'react'
import styled, { useTheme } from 'styled-components/native'

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
  header?: ReactNode
  titleComponent?: React.FC<TextProps>
  subtitleComponent?: React.FC<TextProps>
  title: string
  subtitle?: string
  activeIndex?: number
  mobileBottomFlex?: number
  fullWidth?: true
  separateIconFromTitle?: boolean
} & (PropsWithAnimation | PropsWithIcon)

const SMALL_HEIGHT = 576

export const GenericInfoPageWhite: React.FC<Props> = ({
  separateIconFromTitle = true,
  ...props
}) => {
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
  const theme = useTheme()
  const StyledTitle = useMemo(() => {
    return styled(titleComponent)({
      textAlign: 'center',
    })
  }, [titleComponent])

  const StyledIcon =
    Icon &&
    styled(Icon).attrs(({ theme }) => ({
      size: theme.illustrations.sizes.fullPage,
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
    <React.Fragment>
      {props.header}
      <ContentContainer fullWidth={props.fullWidth as boolean}>
        <Spacer.Flex flex={grid({ sm: 1, default: 2 }, 'height')} />
        <StyledLottieContainer hasHeight={separateIconFromTitle}>
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
        {!!separateIconFromTitle && <Spacer.Flex flex={0.5} />}
        <StyledTitle>{props.title}</StyledTitle>
        {!!props.subtitle && <StyledSubtitle>{props.subtitle}</StyledSubtitle>}
        <Spacer.Flex flex={0.5} />
        {props.children}
        <Spacer.Flex
          flex={
            !theme.isDesktopViewport && props.mobileBottomFlex
              ? props.mobileBottomFlex
              : grid({ default: 1.5, sm: 2 }, 'height')
          }
        />
      </ContentContainer>
    </React.Fragment>
  )
}

const ContentContainer = styled.View<{ fullWidth: boolean }>(({ fullWidth, theme }) => ({
  alignSelf: 'center',
  flex: 1,
  paddingHorizontal: getSpacing(6),
  maxWidth: theme.contentPage.maxWidth,
  overflow: 'scroll',
  width: fullWidth ? '100%' : undefined,
}))

const StyledLottieContainer = styled.View<{ hasHeight?: boolean }>(({ hasHeight }) => ({
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  height: hasHeight ? '30%' : undefined,
}))

const StyledLottieView = styled(LottieView)({
  width: '100%',
  height: '100%',
})
