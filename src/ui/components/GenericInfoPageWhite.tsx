import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { RootNavigateParams } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useAppStateChange } from 'libs/appState'
import LottieView from 'libs/lottie'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { AnimationObject } from 'ui/animations/type'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'
import { TextProps } from 'ui/theme/typography'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type PropsWithAnimation = {
  animation: AnimationObject
}

type PropsWithIcon = {
  icon: React.FC<IconInterface>
}

type Props = {
  headerGoBack?: boolean
  goBackParams?: RootNavigateParams
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
  const { canGoBack, goBack } = useGoBack(...(props.goBackParams ?? homeNavConfig))
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
  const { isDesktopViewport } = useTheme()
  const { top } = useCustomSafeInsets()
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

  const playAnimation = useCallback(() => {
    const lottieAnimation = animationRef.current
    if (animation && lottieAnimation) {
      lottieAnimation.play(0, 62)
    }
  }, [animation])

  useAppStateChange(playAnimation, undefined)
  useEffect(playAnimation, [playAnimation])

  return (
    <React.Fragment>
      {props.headerGoBack && canGoBack() ? (
        <HeaderContainer onPress={goBack} top={top + getSpacing(3.5)} testID="Revenir en arrière">
          <StyledArrowPrevious />
        </HeaderContainer>
      ) : null}
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
            !isDesktopViewport && props.mobileBottomFlex
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

const StyledArrowPrevious = styled(ArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  accessibilityLabel: 'Revenir en arrière',
}))``

const HeaderContainer = styledButton(Touchable)<{ top: number }>(({ theme, top }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))
