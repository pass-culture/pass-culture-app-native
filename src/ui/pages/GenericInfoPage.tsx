import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import { AccessibilityRole, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import {
  useMobileFontScaleToDisplay,
  useWebZoomToDisplay,
} from 'shared/accessibility/helpers/zoomHelpers'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'
import { AnimationObject, LottieColoringMode } from 'ui/animations/type'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { getGenericInfoPageButtons } from 'ui/pages/helpers/getGenericInfoPageButtons'
import { Page } from 'ui/pages/Page'
import { AccessibleIcon, AccessibleRectangleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { illustrationSizes } from 'ui/theme/illustrationSizes'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type ButtonProps = {
  wording: string
  icon?: FunctionComponent<AccessibleIcon>
  disabled?: boolean
  isLoading?: boolean
  accessibilityLabel?: string
} & (
  | {
      onPress: () => void
      onBeforeNavigate?: never
      onAfterNavigate?: never
      navigateTo?: never
      externalNav?: never
      accessibilityRole?: AccessibilityRole
    }
  | {
      navigateTo: InternalNavigationProps['navigateTo']
      onBeforeNavigate?: () => void
      onAfterNavigate?: () => void
      onPress?: never
      externalNav?: never
      accessibilityRole?: never
    }
  | {
      externalNav: ExternalNavigationProps['externalNav']
      onBeforeNavigate?: () => void
      onAfterNavigate?: () => void
      onPress?: never
      navigateTo?: never
      accessibilityRole?: never
    }
)

type AnimationColoringProps = {
  animationColoringMode?: LottieColoringMode
  animationTargetShapeNames?: string[]
  animationTargetLayerNames?: string[]
}

type AnimationProps =
  | {
      illustration: React.FC<AccessibleIcon | AccessibleRectangleIcon>
      animation?: never
      animationColoringMode?: never
      animationTargetShapeNames?: never
      animationTargetLayerNames?: never
    }
  | ({
      animation: AnimationObject
      illustration?: never
    } & AnimationColoringProps)

type Props = PropsWithChildren<{
  withGoBack?: boolean
  withSkipAction?: () => void
  title: string
  subtitle?: string
  buttonsSurtitle?: ReactNode
  buttonPrimary: ButtonProps
  buttonSecondary?: ButtonProps
  buttonTertiary?: ButtonProps
}> &
  AnimationProps

export const GenericInfoPage: React.FunctionComponent<Props> = ({
  withGoBack = false,
  withSkipAction,
  illustration: IllustrationComponent,
  animation,
  title,
  subtitle,
  buttonsSurtitle,
  buttonPrimary,
  buttonSecondary,
  buttonTertiary,
  children,
  animationColoringMode,
  animationTargetLayerNames,
  animationTargetShapeNames,
}) => {
  const { designSystem } = useTheme()
  const isLandscape = useIsLandscape()

  const headerHeight = useGetHeaderHeight()
  const { top } = useSafeAreaInsets()
  const shouldDisplayHeader = withGoBack || withSkipAction
  const placeholderHeight = shouldDisplayHeader ? headerHeight : top
  const marginVertical = useMobileFontScaleToDisplay({
    default: 0,
    at200PercentZoom: getSpacing(25),
  })
  const buttons = getGenericInfoPageButtons({ buttonPrimary, buttonSecondary, buttonTertiary })

  const flexMobile = useMobileFontScaleToDisplay({
    default: undefined,
    at200PercentZoom: 0,
  })
  const flexWeb = useWebZoomToDisplay({ default: 1, at200PercentZoom: undefined })

  return (
    <Page>
      <Header
        shouldDisplayBackButton={withGoBack}
        RightButton={<SkipButton withSkipAction={withSkipAction} />}
      />
      <StyledScrollView showsVerticalScrollIndicator={false}>
        {isLandscape ? null : <Placeholder height={placeholderHeight} />}

        <ContainerFlex flexValue={flexWeb}>
          <ContainerWithCenteredContent marginVertical={marginVertical} flexValue={flexWeb}>
            <IllustrationContainer animation={!!animation}>
              {IllustrationComponent ? (
                <IllustrationComponent
                  size={illustrationSizes.fullPage}
                  color={designSystem.color.icon.brandPrimary}
                />
              ) : null}
              {animation ? (
                <ThemedStyledLottieView
                  source={animation}
                  width="100%"
                  height="100%"
                  coloringMode={animationColoringMode}
                  targetShapeNames={animationTargetShapeNames}
                  targetLayerNames={animationTargetLayerNames}
                />
              ) : null}
            </IllustrationContainer>
            <TextContainer gap={4} flex={flexMobile}>
              <StyledTitle2 {...getHeadingAttrs(1)}>{title}</StyledTitle2>
              {subtitle ? <StyledBody {...getHeadingAttrs(2)}>{subtitle}</StyledBody> : null}
            </TextContainer>

            {children ? <ChildrenContainer>{children}</ChildrenContainer> : null}
          </ContainerWithCenteredContent>

          <ButtonContainer gap={4} isLandscape={isLandscape}>
            {buttonsSurtitle}
            {buttons}
          </ButtonContainer>
        </ContainerFlex>
        <Spacer.BottomScreen />
      </StyledScrollView>
    </Page>
  )
}

const ContainerFlex = styled.View<{ flexValue?: number }>(({ theme, flexValue }) => ({
  justifyContent: theme.isDesktopViewport ? 'center' : 'space-between',
  ...(flexValue !== undefined && { flex: flexValue }),
}))

const ContainerWithCenteredContent = styled.View<{ marginVertical: number; flexValue?: number }>(
  ({ marginVertical, theme, flexValue }) => ({
    justifyContent: 'center',
    ...(flexValue !== undefined && { flex: flexValue }),
    marginVertical,
    marginTop: theme.designSystem.size.spacing.s,
  })
)
const StyledScrollView = styled(ScrollView).attrs(({ theme }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
  },
}))``

const Header = styled(PageHeaderWithoutPlaceholder)({
  borderBottomWidth: 0,
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const IllustrationContainer = styled.View<{ animation: boolean }>(({ animation, theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
  ...(animation && { height: '30%' }),
}))

const TextContainer = styled(ViewGap)<{ flex?: number }>(({ flex }) => ({
  alignItems: 'center',
  flex,
}))

const StyledTitle2 = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ChildrenContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const ButtonContainer = styled(ViewGap)<{ isLandscape: boolean }>(({ isLandscape, theme }) => ({
  alignItems: 'center',
  marginBottom: isLandscape ? getSpacing(40) : theme.designSystem.size.spacing.xxxl,
}))

const SkipButton = ({ withSkipAction }: { withSkipAction?: () => void }) => {
  if (withSkipAction) {
    return (
      <Button
        wording="Passer"
        accessibilityLabel="Passer à la page suivante"
        onPress={withSkipAction}
        variant="tertiary"
        color="neutral"
      />
    )
  }
  return null
}
