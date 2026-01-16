import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import { StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { useColorScheme } from 'libs/styled/useColorScheme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'
import { illustrationSizes } from 'ui/theme/illustrationSizes'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type ButtonProps = {
  wording: string
  icon?: FunctionComponent<AccessibleIcon>
  disabled?: boolean
  isLoading?: boolean
  onPress: () => void
}

type Props = PropsWithChildren<{
  illustration: FunctionComponent<AccessibleIcon>
  title: string
  helmetTitle?: string
  header?: ReactNode
  subtitle?: string
  noIndex?: boolean
  buttonPrimary?: ButtonProps
  buttonTertiary?: ButtonProps
  buttonTertiaryExternalNav?: ReactNode
}>

// NEVER EVER USE NAVIGATION (OR ANYTHING FROM @react-navigation)
// ON THIS PAGE OR IT WILL BREAK!!!
// THE NAVIGATION CONTEXT IS NOT ALWAYS LOADED WHEN WE DISPLAY
// EX: ScreenErrorProvider IS OUTSIDE NAVIGATION!
export const GenericErrorPage: FunctionComponent<Props> = ({
  header,
  illustration: IllustrationComponent,
  title,
  subtitle,
  helmetTitle,
  noIndex = true,
  buttonPrimary,
  buttonTertiary,
  buttonTertiaryExternalNav,
  children,
}) => {
  const { top } = useSafeAreaInsets()
  const { designSystem } = useTheme()
  const colorScheme = useColorScheme()

  return (
    <React.Fragment>
      {helmetTitle && !noIndex ? (
        <Helmet>
          <title>{helmetTitle}</title>
        </Helmet>
      ) : null}
      {noIndex && !helmetTitle ? (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      ) : null}
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={
          colorScheme === 'dark'
            ? designSystem.color.background.lockedInverted
            : designSystem.color.background.locked
        }
      />
      <Page>
        {header}
        <Container>
          <Placeholder height={top} />
          <Spacer.Flex flex={1} />
          <IllustrationContainer>
            {IllustrationComponent ? (
              <IllustrationComponent
                size={illustrationSizes.fullPage}
                color={designSystem.color.icon.brandPrimary}
              />
            ) : null}
          </IllustrationContainer>
          <TextContainer gap={4}>
            <StyledTitle {...getHeadingAttrs(1)}>{title}</StyledTitle>
            {subtitle ? <StyledSubtitle {...getHeadingAttrs(2)}>{subtitle}</StyledSubtitle> : null}
          </TextContainer>
          {children ? <ChildrenContainer>{children}</ChildrenContainer> : null}
          {buttonPrimary || buttonTertiary || buttonTertiaryExternalNav ? (
            <ButtonContainer gap={4}>
              {buttonPrimary?.onPress ? (
                <ButtonPrimary
                  key={1}
                  wording={buttonPrimary.wording}
                  onPress={buttonPrimary.onPress}
                  isLoading={buttonPrimary.isLoading}
                  disabled={buttonPrimary.disabled}
                  icon={buttonPrimary.icon}
                />
              ) : null}

              {buttonTertiary?.onPress ? (
                <ButtonTertiaryBlack
                  key={2}
                  wording={buttonTertiary.wording}
                  onPress={buttonTertiary.onPress}
                  isLoading={buttonTertiary.isLoading}
                  disabled={buttonTertiary.disabled}
                  icon={buttonTertiary.icon}
                />
              ) : null}

              {buttonTertiaryExternalNav}
            </ButtonContainer>
          ) : null}
          <Spacer.Flex flex={1} />
        </Container>
      </Page>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
  overflow: 'scroll',
}))

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const IllustrationContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledTitle = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledSubtitle = styled(Typo.Body)({
  textAlign: 'center',
})

const TextContainer = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const ChildrenContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const ButtonContainer = styled(ViewGap)({
  alignItems: 'center',
})
