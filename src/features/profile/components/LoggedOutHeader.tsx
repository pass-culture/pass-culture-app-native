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
      <Spacer.Column numberOfSpaces={12} />
      <HeaderContent>
        <Typo.Title4 color={ColorsEnum.WHITE}>{t`Profil`}</Typo.Title4>
        <Spacer.Column numberOfSpaces={7} />
        <Description color={ColorsEnum.WHITE}>
          {t`Inscris-toi pour accéder à toutes les fonctionnalités de l’application`}
        </Description>
        <Spacer.Column numberOfSpaces={8.5} />
        <ButtonPrimaryWhite
          title={t`S'inscrire`}
          onPress={() => {
            analytics.logProfilSignUp()
            navigate('SetEmail', { preventCancellation: true })
          }}
        />
        <Spacer.Column numberOfSpaces={5} />
        <LoginCta>
          <Typo.Body color={ColorsEnum.WHITE}>{t`Tu as déjà un compte ?` + '\u00a0'}</Typo.Body>
          <TouchableOpacity
            onPress={() => navigate('Login', { preventCancellation: true })}
            testID="login-button">
            <Typo.ButtonText color={ColorsEnum.WHITE}>{t`Connecte-toi`}</Typo.ButtonText>
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
  paddingRight: getSpacing(5),
  paddingLeft: getSpacing(5),
  width: '100%',
})

const LoginCta = styled.View({
  flexDirection: 'row',
})

const Description = styled(Typo.Body)({
  textAlign: 'center',
})
