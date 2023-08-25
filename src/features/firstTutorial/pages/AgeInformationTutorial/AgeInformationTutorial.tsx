import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { Animated, Platform } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getAge } from 'shared/user/getAge'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { AnimatedBlurHeader } from 'ui/components/headers/AnimatedBlurHeader'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { InfoBanner } from 'ui/components/InfoBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  selectedAge?: 15 | 16 | 17 | 18
}

export const AgeInformationTutorial: FunctionComponent<Props> = ({ selectedAge }) => {
  const { isLoggedIn, user } = useAuthContext()
  const { goBack } = useNavigation<UseNavigationType>()
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()
  const theme = useTheme()
  const { animationState, containerStyle, blurContainerNative } = getAnimationState(
    theme,
    headerTransition
  )

  const [ariaHiddenTitle, setAriaHiddenTitle] = useState(true)
  headerTransition.addListener((opacity) => setAriaHiddenTitle(opacity.value !== 1))

  const defaultAge = selectedAge ?? 15
  const age = user?.birthDate ? getAge(user.birthDate) : defaultAge

  const headerTitle = isLoggedIn ? 'Comment ça marche\u00a0?' : `Le pass Culture à ${age} ans`

  return (
    <React.Fragment>
      <StyledScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={7} />
        <Typo.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
          {headerTitle}
        </Typo.Title3>
        <Spacer.Column numberOfSpaces={8} />
        <InfoBanner message="Cette page a-t-elle été utile&nbsp;? Aide-nous à l’améliorer en répondant à notre questionnaire.">
          <ButtonQuaternarySecondary
            justifyContent="flex-start"
            icon={ExternalSiteFilled}
            wording="Donner mon avis"
          />
        </InfoBanner>
        {!isLoggedIn ? (
          <Container>
            <Spacer.Column numberOfSpaces={4} />
            <InternalTouchableLink
              as={ButtonWithLinearGradient}
              wording="Créer un compte"
              navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
            />
            <Spacer.Column numberOfSpaces={4} />
            <StyledLoginButton />
          </Container>
        ) : null}
        <Placeholder height={2000} />
      </StyledScrollView>
      <HeaderContainer style={containerStyle} height={headerHeight}>
        <Spacer.TopScreen />
        <AnimatedBlurHeader height={headerHeight} style={blurContainerNative} />
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <Spacer.Row numberOfSpaces={6} />
          <RoundedButton
            animationState={animationState}
            iconName="back"
            onPress={goBack}
            accessibilityLabel="Revenir en arrière"
            finalColor={theme.colors.black}
          />
          <Spacer.Row numberOfSpaces={10} />
          <Spacer.Flex />
          <Title style={{ opacity: headerTransition }} accessibilityHidden={ariaHiddenTitle}>
            <Body>{headerTitle}</Body>
          </Title>
          <Spacer.Flex />
          <Spacer.Row numberOfSpaces={25} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>
    </React.Fragment>
  )
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: getSpacing(6),
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const StyledLoginButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  type: 'login',
  linkColor: theme.colors.secondary,
}))``

const Container = styled.View({
  flexDirection: 'column',
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const HeaderContainer = styled(Animated.View)<{ height: number }>(({ theme, height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
  zIndex: theme.zIndex.header,
  borderBottomColor: theme.colors.greyLight,
  borderBottomWidth: 1,
}))

const Title = styled(Animated.Text).attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  flexShrink: 1,
  textAlign: 'center',
  color: theme.colors.white,
  ...(Platform.OS === 'web' ? { whiteSpace: 'pre-wrap' } : {}),
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
