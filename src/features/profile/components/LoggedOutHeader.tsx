import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, getSpacing, ScreenWidth, Spacer, Typo } from 'ui/theme'

export function LoggedOutHeader() {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <HeaderBackgroundWrapper>
      <HeaderBackground width={ScreenWidth} />
      <HeaderContent>
        <Typo.Title4 color={ColorsEnum.WHITE}>{_(t`Profil`)}</Typo.Title4>
        <Spacer.Column numberOfSpaces={8} />
        <Description color={ColorsEnum.WHITE}>
          {_(t`Inscris-toi pour accéder à toutes les fonctionnalités de l’appication`)}
        </Description>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimaryWhite title={_(t`S'inscrire`)} onPress={() => navigate('SetEmail')} />
        <Spacer.Column numberOfSpaces={4} />
        <ConnecteToi>
          <Typo.Body color={ColorsEnum.WHITE}>{_(t`Tu as déjà un compte ?\u00a0`)}</Typo.Body>
          <TouchableOpacity onPress={() => navigate('Login')} testID="login-button">
            <Typo.ButtonText color={ColorsEnum.WHITE}>{_(t`Connecte-toi`)}</Typo.ButtonText>
          </TouchableOpacity>
        </ConnecteToi>
      </HeaderContent>
    </HeaderBackgroundWrapper>
  )
}

const ConnecteToi = styled.View({
  flexDirection: 'row',
})

const HeaderContent = styled.View({
  position: 'absolute',
  alignItems: 'center',
  padding: getSpacing(5),
  paddingTop: getSpacing(8),
  width: '100%',
})

const Description = styled(Typo.Body)({
  textAlign: 'center',
})

const HeaderBackgroundWrapper = styled.View({
  maxHeight: getSpacing(73.5),
})
