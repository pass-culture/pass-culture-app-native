import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { getPrimaryIllustration } from 'shared/illustrations/getPrimaryIllustration'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type ButtonProps = {
  wording: string
  icon?: FunctionComponent<AccessibleIcon>
  disabled?: boolean
  isLoading?: boolean
} & (
  | {
      onPress: () => void
      externalNav?: never
      onBeforeNavigate?: never
      onAfterNavigate?: never
    }
  | {
      externalNav: ExternalNavigationProps['externalNav']
      onPress?: never
      onBeforeNavigate?: () => void
      onAfterNavigate?: () => void
    }
)

type Props = PropsWithChildren<{
  illustration: FunctionComponent<AccessibleIcon>
  title: string
  helmetTitle?: string
  header?: ReactNode
  subtitle?: string
  noIndex?: boolean
  buttonPrimary?: ButtonProps
  buttonTertiary?: ButtonProps
}>

// NEVER EVER USE NAVIGATION (OR ANYTHING FROM @react-navigation)
// ON THIS PAGE OR IT WILL BREAK!!!
// THE NAVIGATION CONTEXT IS NOT ALWAYS LOADED WHEN WE DISPLAY
// EX: ScreenErrorProvider IS OUTSIDE NAVIGATION!
export const GenericErrorPage: FunctionComponent<Props> = ({
  header,
  illustration,
  title,
  subtitle,
  helmetTitle,
  noIndex = true,
  buttonPrimary,
  buttonTertiary,
  children,
}) => {
  const { top, bottom } = useSafeAreaInsets()
  const Illustration = getPrimaryIllustration(illustration)

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
      <Page>
        {header}
        <Container bottom={bottom}>
          <Placeholder height={top} />
          <Spacer.Flex flex={1} />
          <IllustrationContainer>{Illustration ? <Illustration /> : null}</IllustrationContainer>
          <TextContainer gap={4}>
            <StyledTitle {...getHeadingAttrs(1)}>{title}</StyledTitle>
            {subtitle ? <StyledSubtitle {...getHeadingAttrs(2)}>{subtitle}</StyledSubtitle> : null}
          </TextContainer>
          {children ? <ChildrenContainer>{children}</ChildrenContainer> : null}
          {buttonPrimary || buttonTertiary ? (
            <ButtonContainer gap={4}>
              {buttonPrimary?.onPress ? (
                <ButtonPrimary
                  key={1}
                  wording={buttonPrimary.wording}
                  onPress={buttonPrimary.onPress}
                  isLoading={buttonPrimary.isLoading}
                  disabled={buttonPrimary.disabled}
                  icon={buttonPrimary.icon}
                  buttonHeight="tall"
                />
              ) : null}

              {buttonPrimary?.externalNav ? (
                <ExternalTouchableLink
                  key={1}
                  as={ButtonPrimary}
                  wording={buttonPrimary.wording}
                  externalNav={buttonPrimary.externalNav}
                  onBeforeNavigate={buttonPrimary.onBeforeNavigate}
                  onAfterNavigate={buttonPrimary.onAfterNavigate}
                  isLoading={buttonPrimary.isLoading}
                  disabled={buttonPrimary.disabled}
                  icon={buttonPrimary.icon ?? ExternalSiteFilled}
                  buttonHeight="tall"
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

              {buttonTertiary?.externalNav ? (
                <ExternalTouchableLink
                  key={2}
                  as={ButtonTertiaryBlack}
                  wording={buttonTertiary.wording}
                  externalNav={buttonTertiary.externalNav}
                  onBeforeNavigate={buttonTertiary.onBeforeNavigate}
                  onAfterNavigate={buttonTertiary.onAfterNavigate}
                  isLoading={buttonTertiary.isLoading}
                  disabled={buttonTertiary.disabled}
                  icon={ExternalSiteFilled}
                />
              ) : null}
            </ButtonContainer>
          ) : null}
          <Spacer.Flex flex={1} />
        </Container>
      </Page>
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

const IllustrationContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: getSpacing(6),
})

const StyledTitle = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledSubtitle = styled(Typo.Body)({
  textAlign: 'center',
})

const TextContainer = styled(ViewGap)({
  alignItems: 'center',
  marginBottom: getSpacing(8),
})

const ChildrenContainer = styled.View({
  marginBottom: getSpacing(8),
})

const ButtonContainer = styled(ViewGap)({
  alignItems: 'center',
})
