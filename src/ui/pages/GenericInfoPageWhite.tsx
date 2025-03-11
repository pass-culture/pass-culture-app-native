import React, { FunctionComponent, PropsWithChildren } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'
import { usePartialLottieAnimation } from 'shared/animations/useLottieAnimation'
import { getPrimaryIllustration } from 'shared/illustrations/getPrimaryIllustration'
import { AnimationObject } from 'ui/animations/type'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ButtonTertiaryNeutralInfo } from 'ui/components/buttons/ButtonTertiaryNeutralInfo'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type ButtonProps = {
  wording: string
  icon?: FunctionComponent<AccessibleIcon>
} & (
  | { navigateTo: InternalNavigationProps['navigateTo']; onPress?: never }
  | { onPress: () => void; navigateTo?: never }
)

type Props = PropsWithChildren<
  {
    withGoBack?: boolean
    withSkipAction?: () => void
    title: string
    subtitle?: string
    buttonPrimary: ButtonProps
    buttonSecondary?: ButtonProps
    buttonTertiary?: ButtonProps
  } & (
    | { illustration: React.FC<AccessibleIcon>; animation?: never }
    | { animation: AnimationObject; illustration?: never }
  )
>

export const GenericInfoPageWhite: React.FunctionComponent<Props> = ({
  withGoBack = false,
  withSkipAction,
  illustration,
  animation,
  title,
  subtitle,
  buttonPrimary,
  buttonSecondary,
  buttonTertiary,
  children,
}) => {
  const { isDesktopViewport } = useTheme()

  const headerHeight = useGetHeaderHeight()
  const { top, bottom } = useSafeAreaInsets()
  const shouldDisplayHeader = withGoBack || withSkipAction
  const placeholderHeight = shouldDisplayHeader ? headerHeight : top

  const Illustration = getPrimaryIllustration(illustration)
  const animationRef = usePartialLottieAnimation(animation)

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder
        shouldDisplayBackButton={withGoBack}
        RightButton={<SkipButton withSkipAction={withSkipAction} />}
      />

      <Container bottom={bottom}>
        <Placeholder height={placeholderHeight} />

        <Spacer.Flex flex={1} />

        <IllustrationContainer animation={animation}>
          {Illustration ? <Illustration /> : null}
          {animation ? (
            <StyledLottieView ref={animationRef} source={animation} loop={false} />
          ) : null}
        </IllustrationContainer>

        <TextContainer gap={4}>
          <StyledTitle2 {...getHeadingAttrs(1)}>{title}</StyledTitle2>
          <StyledBody {...getHeadingAttrs(2)}>{subtitle}</StyledBody>
        </TextContainer>

        {children ? <ChildrenContainer>{children}</ChildrenContainer> : null}

        {isDesktopViewport ? null : <Spacer.Flex flex={1} />}

        <ButtonContainer gap={4}>
          {buttonPrimary.navigateTo ? (
            <InternalTouchableLink
              key={1}
              as={ButtonPrimary}
              wording={buttonPrimary.wording}
              navigateTo={buttonPrimary.navigateTo}
            />
          ) : null}

          {buttonPrimary.onPress ? (
            <ButtonPrimary
              key={1}
              wording={buttonPrimary.wording}
              onPress={buttonPrimary.onPress}
            />
          ) : null}

          {buttonSecondary && buttonSecondary.navigateTo ? (
            <InternalTouchableLink
              key={2}
              as={ButtonSecondary}
              wording={buttonSecondary.wording}
              navigateTo={buttonSecondary.navigateTo}
            />
          ) : null}

          {buttonSecondary && buttonSecondary.onPress ? (
            <ButtonSecondary
              key={2}
              wording={buttonSecondary.wording}
              onPress={buttonSecondary.onPress}
            />
          ) : null}

          {buttonTertiary && buttonTertiary.navigateTo ? (
            <InternalTouchableLink
              key={buttonSecondary ? 3 : 2}
              as={ButtonTertiaryBlack}
              wording={buttonTertiary.wording}
              navigateTo={buttonTertiary.navigateTo}
            />
          ) : null}

          {buttonTertiary && buttonTertiary.onPress ? (
            <ButtonTertiaryBlack
              key={buttonSecondary ? 3 : 2}
              wording={buttonTertiary.wording}
              onPress={buttonTertiary.onPress}
            />
          ) : null}
        </ButtonContainer>
        {isDesktopViewport ? <Spacer.Flex flex={1} /> : null}
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View<{ top: number; bottom: number }>(({ theme }) => ({
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
  overflow: 'scroll',
}))

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const IllustrationContainer = styled.View<{ animation: boolean }>(({ animation }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  ...(animation && {
    height: '30%',
    marginBottom: getSpacing(6),
  }),
}))

const StyledLottieView = styled(LottieView)({
  width: '100%',
  height: '100%',
})

const TextContainer = styled(ViewGap)({
  alignItems: 'center',
  marginBottom: getSpacing(6),
})

const StyledTitle2 = styled(TypoDS.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})

const ChildrenContainer = styled.View({
  marginBottom: getSpacing(6),
})

const ButtonContainer = styled(ViewGap)({
  alignItems: 'center',
})

const SkipButton = ({ withSkipAction }: { withSkipAction?: () => void }) => {
  if (withSkipAction) {
    return (
      <ButtonTertiaryNeutralInfo
        wording="Passer"
        accessibilityLabel="Aller à la page suivante"
        onPress={withSkipAction}
        inline
      />
    )
  }
  return null
}
