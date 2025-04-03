import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { getPrimaryIllustration } from 'shared/illustrations/getPrimaryIllustration'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type ButtonProps = {
  wording: string
  icon?: FunctionComponent<AccessibleIcon>
  disabled?: boolean
  isLoading?: boolean
  onPress: () => void
  onBeforeNavigate?: never
  onAfterNavigate?: never
}

type Props = PropsWithChildren<{
  illustration: FunctionComponent<AccessibleIcon>
  title: string
  helmetTitle?: string
  header?: ReactNode
  subtitle?: string
  noIndex?: boolean
  button?: ButtonProps
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
  button,
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
          {button ? (
            <ButtonContainer>
              <ButtonPrimary
                key={1}
                wording={button.wording}
                onPress={button.onPress}
                isLoading={button.isLoading}
                disabled={button.disabled}
                icon={button.icon}
                buttonHeight="tall"
              />
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

const ButtonContainer = styled.View({
  alignItems: 'center',
})
