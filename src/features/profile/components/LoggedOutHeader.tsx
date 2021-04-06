import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, getSpacing, ScreenWidth, Spacer, Typo } from 'ui/theme'

export function LoggedOutHeader() {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <Container>
      <HeaderBackgroundWrapper>
        <HeaderBackground width={ScreenWidth} />
      </HeaderBackgroundWrapper>
      <HeaderContent>
        <Typo.Title4 color={ColorsEnum.WHITE}>{t`Profil`}</Typo.Title4>
        <Spacer.Column numberOfSpaces={8} />
        <Description color={ColorsEnum.WHITE}>
          {t`Inscris-toi pour accéder à toutes les fonctionnalités de l’application`}
        </Description>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimaryWhite
          title={t`S'inscrire`}
          onPress={() => {
            analytics.logProfilSignUp()
            navigate('SetEmail', { preventCancellation: true })
          }}
        />
        <Spacer.Column numberOfSpaces={4} />
        <LoginCta>
          <Typo.Body color={ColorsEnum.WHITE}>{t`Tu as déjà un compte ?\u00a0`}</Typo.Body>
          <TouchableOpacity
            onPress={() => navigate('Login', { preventCancellation: true })}
            testID="login-button">
            <Typo.ButtonText color={ColorsEnum.WHITE}>{t`Connecte-toi`}</Typo.ButtonText>
          </TouchableOpacity>
        </LoginCta>
      </HeaderContent>
    </Container>
  )
}

const Container = styled.View({
  overflow: 'hidden',
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
})

const HeaderContent = styled.View({
  alignItems: 'center',
  padding: getSpacing(5),
  paddingTop: getSpacing(10),
  width: '100%',
})

const LoginCta = styled.View({
  flexDirection: 'row',
})

const Description = styled(Typo.Body)({
  textAlign: 'center',
})
