import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
export function LoggedOutHeader() {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <Container>
      <Spacer.TopScreen />
      <HeaderBackgroundWrapper>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.Column numberOfSpaces={6} />
      <HeaderContent>
        <Title>{t`Profil`}</Title>
        <Spacer.Column numberOfSpaces={7} />
        <Description>
          {t`Inscris-toi pour accéder à toutes les fonctionnalités de l’application`}
        </Description>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimaryWhite
          testID="S'inscrire"
          wording={t`S'inscrire`}
          onPress={() => {
            analytics.logProfilSignUp()
            navigate('SignupForm', { preventCancellation: true })
          }}
        />
        <Spacer.Column numberOfSpaces={5} />
        <LoginCta>
          <Body>{t`Tu as déjà un compte\u00a0?` + '\u00a0'}</Body>
          <TouchableOpacity
            onPress={() => navigate('Login', { preventCancellation: true })}
            {...accessibilityAndTestId(t`Connecte-toi`)}>
            <ButtonText>{t`Connecte-toi`}</ButtonText>
          </TouchableOpacity>
        </LoginCta>
        <Spacer.Column numberOfSpaces={7} />
      </HeaderContent>
    </Container>
  )
}

const Container = styled.View({
  overflow: 'hidden',
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
  top: 0,
  maxHeight: getSpacing(73.5),
})

const HeaderContent = styled.View({
  alignItems: 'center',
  paddingHorizontal: getSpacing(5),
  width: '100%',
})

const LoginCta = styled.View({
  flexDirection: 'row',
})

const Description = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))(({ theme }) => ({
  color: theme.colors.white,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))
