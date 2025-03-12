import React, { useMemo } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { RootNavigateParams } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import LottieView from 'libs/lottie'
import { usePartialLottieAnimation } from 'shared/animations/useLottieAnimation'
import { AnimationObject } from 'ui/animations/type'
import { ButtonTertiaryNeutralInfo } from 'ui/components/buttons/ButtonTertiaryNeutralInfo'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'
import { TextProps } from 'ui/theme/typography'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type PropsWithAnimation = {
  animation: AnimationObject
}

type PropsWithIcon = {
  icon: React.FC<AccessibleIcon>
  iconSize?: number
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
  separateIconFromTitle?: boolean
  onSkip?: () => void
  children?: React.ReactNode
} & (PropsWithAnimation | PropsWithIcon)

export const GenericInfoPageWhiteLegacy: React.FC<Props> = ({
  separateIconFromTitle = true,
  onSkip,
  ...props
}) => {
  const { canGoBack, goBack } = useGoBack(...(props.goBackParams ?? homeNavConfig))
  const grid = useGrid()

  const { animation } = props as PropsWithAnimation
  const { icon: Icon, iconSize } = props as PropsWithIcon
  const titleComponent = props.titleComponent ?? TypoDS.Title1
  const subtitleComponent = props.subtitleComponent ?? TypoDS.Title4
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
      size: iconSize || theme.illustrations.sizes.fullPage,
    }))({ width: '100%' })

  const StyledSubtitle = useMemo(() => {
    return styled(subtitleComponent)({
      textAlign: 'center',
    })
  }, [subtitleComponent])

  const animationRef = usePartialLottieAnimation(animation)

  return (
    <React.Fragment>
      {props.headerGoBack && canGoBack() ? (
        <HeaderContainer
          onPress={goBack}
          top={top + getSpacing(3.5)}
          accessibilityLabel="Revenir en arrière">
          <StyledArrowPrevious />
        </HeaderContainer>
      ) : null}
      {onSkip ? (
        <SkipButtonContainer top={top + getSpacing(3.5)}>
          <ButtonTertiaryNeutralInfo
            wording="Passer"
            accessibilityLabel="Aller à l’écran suivant"
            onPress={onSkip}
          />
        </SkipButtonContainer>
      ) : null}
      <ContentContainer>
        <Spacer.Flex flex={grid({ sm: 1, default: 2 }, 'height')} />
        <StyledLottieContainer hasHeight={separateIconFromTitle}>
          {animation ? (
            <StyledLottieView
              key={props?.activeIndex}
              ref={animationRef}
              source={animation}
              loop={false}
            />
          ) : (
            <StyledIcon />
          )}
        </StyledLottieContainer>
        {separateIconFromTitle ? <Spacer.Flex flex={0.5} /> : null}
        <StyledTitle {...getHeadingAttrs(1)}>{props.title}</StyledTitle>
        {props.subtitle ? (
          <StyledSubtitle {...getHeadingAttrs(2)}>{props.subtitle}</StyledSubtitle>
        ) : null}
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

const ContentContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  flex: 1,
  paddingHorizontal: getSpacing(6),
  maxWidth: theme.contentPage.maxWidth,
  overflow: Platform.OS === 'web' ? 'auto' : 'scroll',
  width: '100%',
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

const SkipButtonContainer = styled.View<{ top: number }>(({ theme, top }) => ({
  position: 'absolute',
  top,
  right: getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))
