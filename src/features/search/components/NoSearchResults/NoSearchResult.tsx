import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type NoSearchResultProps = {
  title: string
  subtitle?: string
  errorDescription: string
  ctaWording: string
  onPress: VoidFunction
}

export const NoSearchResult: React.FC<NoSearchResultProps> = ({
  title,
  subtitle,
  errorDescription,
  ctaWording,
  onPress,
}) => {
  return (
    <Container accessibilityRole={AccessibilityRole.STATUS}>
      <ContainerNoOffer>
        <StyledNoOffer />
      </ContainerNoOffer>
      <ContainerText>
        <Title>{title}</Title>
        {subtitle ? <Typo.Body>{subtitle}</Typo.Body> : null}
        <ErrorDescriptionContainer>
          <ErrorDescription accessibilityLiveRegion="assertive">
            {errorDescription}
          </ErrorDescription>
        </ErrorDescriptionContainer>
      </ContainerText>
      <View>
        <ButtonPrimary wording={ctaWording} onPress={onPress} />
      </View>
    </Container>
  )
}

const ContainerNoOffer = styled.View(({ theme }) => ({
  flexShrink: 0,
  ...(theme.isMobileViewport && { marginTop: -(theme.tabBar.height + getSpacing(10)) }),
}))

const StyledNoOffer = styled(NoOffer).attrs(({ theme }) => ({
  size: theme.isDesktopViewport
    ? theme.illustrations.sizes.fullPage
    : theme.illustrations.sizes.medium,
  color: theme.designSystem.color.icon.subtle,
}))``

const Container = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  ...(theme.isDesktopViewport ? {} : { marginHorizontal: theme.designSystem.size.spacing.xl }),
}))

const ContainerText = styled.View(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
  maxWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))

const Title = styled(Typo.Title4).attrs({
  ...getHeadingAttrs(2),
})(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const ErrorDescription = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const ErrorDescriptionContainer = styled(Typo.Body)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  textAlign: 'center',
}))
