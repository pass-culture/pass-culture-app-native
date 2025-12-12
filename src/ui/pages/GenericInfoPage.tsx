import React, { FunctionComponent, PropsWithChildren } from 'react'
import { AccessibilityRole } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { accessibilityRoleInternalNavigation } from 'shared/accessibility/accessibilityRoleInternalNavigation'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'
import { AnimationObject } from 'ui/animations/type'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ButtonTertiaryNeutralInfo } from 'ui/components/buttons/ButtonTertiaryNeutralInfo'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
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
    | { illustration: React.FC<AccessibleIcon | AccessibleRectangleIcon>; animation?: never }
    | { animation: AnimationObject; illustration?: never }
  )
>

export const GenericInfoPage: React.FunctionComponent<Props> = ({
  withGoBack = false,
  withSkipAction,
  illustration: IllustrationComponent,
  animation,
  title,
  subtitle,
  buttonPrimary,
  buttonSecondary,
  buttonTertiary,
  children,
}) => {
  const { isDesktopViewport, designSystem } = useTheme()
  const isLandscape = useIsLandscape()

  const headerHeight = useGetHeaderHeight()
  const { top } = useSafeAreaInsets()
  const shouldDisplayHeader = withGoBack || withSkipAction
  const placeholderHeight = shouldDisplayHeader ? headerHeight : top
  const onPressAccessibilityRole = accessibilityRoleInternalNavigation()

  return (
    <Page>
      <Header
        shouldDisplayBackButton={withGoBack}
        RightButton={<SkipButton withSkipAction={withSkipAction} />}
      />

      <Container>
        {isLandscape ? null : <Placeholder height={placeholderHeight} />}

        <Spacer.Flex flex={1} />

        <IllustrationContainer animation={!!animation}>
          {IllustrationComponent ? (
            <IllustrationComponent
              size={illustrationSizes.fullPage}
              color={designSystem.color.icon.brandPrimary}
            />
          ) : null}
          {animation ? (
            <ThemedStyledLottieView source={animation} width="100%" height="100%" />
          ) : null}
        </IllustrationContainer>

        <TextContainer gap={4}>
          <StyledTitle2 {...getHeadingAttrs(1)}>{title}</StyledTitle2>
          {subtitle ? <StyledBody {...getHeadingAttrs(2)}>{subtitle}</StyledBody> : null}
        </TextContainer>

        {children ? <ChildrenContainer>{children}</ChildrenContainer> : null}

        {isDesktopViewport ? null : <Spacer.Flex flex={1} />}

        <ButtonContainer gap={4} isLandscape={isLandscape}>
          {buttonPrimary.onPress ? (
            <ButtonPrimary
              key={1}
              wording={buttonPrimary.wording}
              onPress={buttonPrimary.onPress}
              isLoading={buttonPrimary.isLoading}
              disabled={buttonPrimary.disabled}
              icon={buttonPrimary.icon}
              accessibilityLabel={buttonPrimary.accessibilityLabel}
              accessibilityRole={buttonPrimary.accessibilityRole ?? onPressAccessibilityRole}
            />
          ) : null}

          {buttonPrimary.navigateTo ? (
            <InternalTouchableLink
              key={1}
              as={ButtonPrimary}
              wording={buttonPrimary.wording}
              navigateTo={buttonPrimary.navigateTo}
              onBeforeNavigate={buttonPrimary.onBeforeNavigate}
              onAfterNavigate={buttonPrimary.onAfterNavigate}
              isLoading={buttonPrimary.isLoading}
              disabled={buttonPrimary.disabled}
              icon={buttonPrimary.icon}
              accessibilityLabel={buttonPrimary.accessibilityLabel}
            />
          ) : null}

          {buttonPrimary.externalNav ? (
            <ExternalTouchableLink
              key={1}
              as={ButtonPrimary}
              wording={buttonPrimary.wording}
              externalNav={buttonPrimary.externalNav}
              onBeforeNavigate={buttonPrimary.onBeforeNavigate}
              onAfterNavigate={buttonPrimary.onAfterNavigate}
              isLoading={buttonPrimary.isLoading}
              disabled={buttonPrimary.disabled}
              icon={ExternalSiteFilled}
              accessibilityLabel={buttonPrimary.accessibilityLabel}
            />
          ) : null}

          {buttonSecondary?.onPress ? (
            <ButtonSecondary
              key={2}
              wording={buttonSecondary.wording}
              onPress={buttonSecondary.onPress}
              isLoading={buttonSecondary.isLoading}
              disabled={buttonSecondary.disabled}
              icon={buttonSecondary.icon}
              accessibilityLabel={buttonSecondary.accessibilityLabel}
              accessibilityRole={buttonSecondary.accessibilityRole ?? onPressAccessibilityRole}
            />
          ) : null}

          {buttonSecondary?.navigateTo ? (
            <InternalTouchableLink
              key={2}
              as={ButtonSecondary}
              wording={buttonSecondary.wording}
              navigateTo={buttonSecondary.navigateTo}
              onBeforeNavigate={buttonSecondary.onBeforeNavigate}
              onAfterNavigate={buttonSecondary.onAfterNavigate}
              isLoading={buttonSecondary.isLoading}
              disabled={buttonSecondary.disabled}
              icon={buttonSecondary.icon}
              accessibilityLabel={buttonSecondary.accessibilityLabel}
            />
          ) : null}

          {buttonSecondary?.externalNav ? (
            <ExternalTouchableLink
              key={2}
              as={ButtonSecondary}
              wording={buttonSecondary.wording}
              externalNav={buttonSecondary.externalNav}
              onBeforeNavigate={buttonSecondary.onBeforeNavigate}
              onAfterNavigate={buttonSecondary.onAfterNavigate}
              isLoading={buttonSecondary.isLoading}
              disabled={buttonSecondary.disabled}
              icon={ExternalSiteFilled}
              accessibilityLabel={buttonSecondary.accessibilityLabel}
            />
          ) : null}

          {buttonTertiary?.onPress ? (
            <ButtonTertiaryBlack
              key={buttonTertiary ? 3 : 2}
              wording={buttonTertiary.wording}
              onPress={buttonTertiary.onPress}
              isLoading={buttonTertiary.isLoading}
              disabled={buttonTertiary.disabled}
              icon={buttonTertiary.icon}
              accessibilityLabel={buttonTertiary.accessibilityLabel}
              accessibilityRole={buttonTertiary.accessibilityRole ?? onPressAccessibilityRole}
            />
          ) : null}

          {buttonTertiary?.navigateTo ? (
            <InternalTouchableLink
              key={buttonTertiary ? 3 : 2}
              as={ButtonTertiaryBlack}
              wording={buttonTertiary.wording}
              navigateTo={buttonTertiary.navigateTo}
              onBeforeNavigate={buttonTertiary.onBeforeNavigate}
              onAfterNavigate={buttonTertiary.onAfterNavigate}
              isLoading={buttonTertiary.isLoading}
              disabled={buttonTertiary.disabled}
              icon={buttonTertiary.icon}
              accessibilityLabel={buttonTertiary.accessibilityLabel}
            />
          ) : null}

          {buttonTertiary?.externalNav ? (
            <ExternalTouchableLink
              key={buttonTertiary ? 3 : 2}
              as={ButtonTertiaryBlack}
              wording={buttonTertiary.wording}
              externalNav={buttonTertiary.externalNav}
              onBeforeNavigate={buttonTertiary.onBeforeNavigate}
              onAfterNavigate={buttonTertiary.onAfterNavigate}
              isLoading={buttonTertiary.isLoading}
              disabled={buttonTertiary.disabled}
              icon={ExternalSiteFilled}
              accessibilityLabel={buttonTertiary.accessibilityLabel}
            />
          ) : null}
        </ButtonContainer>
        {isDesktopViewport ? <Spacer.Flex flex={1} /> : null}
        <Spacer.BottomScreen />
      </Container>
    </Page>
  )
}

const Container = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { flexGrow: 1, justifyContent: 'space-between' },
})(({ theme }) => ({
  flex: 1,
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
}))

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

const TextContainer = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
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

const ButtonContainer = styled(ViewGap)<{ isLandscape: boolean }>(({ isLandscape }) => ({
  alignItems: 'center',
  marginBottom: isLandscape ? getSpacing(40) : 0,
}))

const SkipButton = ({ withSkipAction }: { withSkipAction?: () => void }) => {
  if (withSkipAction) {
    return (
      <ButtonTertiaryNeutralInfo
        wording="Passer"
        accessibilityRole={accessibilityRoleInternalNavigation()}
        accessibilityLabel="Passer à la page suivante"
        onPress={withSkipAction}
        inline
      />
    )
  }
  return null
}
