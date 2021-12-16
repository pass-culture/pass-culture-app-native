import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { AppButton } from 'ui/components/buttons/AppButton'
import { Background } from 'ui/svg/Background'
import { CreateAccount } from 'ui/svg/icons/CreateAccount'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const NotConnectedFavorites = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <Container>
      <Background />
      <Spacer.TopScreen />
      <Spacer.Flex />
      <CreateAccount color={ColorsEnum.WHITE} />

      <CenteredContainer>
        <TypoTitle4 color={ColorsEnum.WHITE}>
          {t`Connecte-toi pour profiter de cette fonctionnalité\u00a0!`}
        </TypoTitle4>
        <Spacer.Column numberOfSpaces={4} />

        <TextContainer>
          <CenteredText>
            <Typo.Body color={ColorsEnum.WHITE}>
              {t`Ton compte te permettra de retrouver tous tes favoris en un clin d'oeil\u00a0!`}
            </Typo.Body>
          </CenteredText>
        </TextContainer>
      </CenteredContainer>

      <Row>
        <ButtonContainer>
          <AppButton
            title={t`S'inscrire`}
            onPress={() => navigate('SignupForm')}
            backgroundColor={ColorsEnum.WHITE}
            textColor={ColorsEnum.PRIMARY}
            loadingIconColor={ColorsEnum.WHITE}
            buttonHeight="tall"
          />
          <Spacer.Column numberOfSpaces={4} />
          <AppButton
            title={t`Se connecter`}
            onPress={() => navigate('Login')}
            backgroundColor={ColorsEnum.TRANSPARENT}
            textColor={ColorsEnum.WHITE}
            loadingIconColor={ColorsEnum.WHITE}
            buttonHeight="tall"
          />
        </ButtonContainer>
      </Row>
      <Spacer.Column numberOfSpaces={12} />
      <Spacer.Flex />
      <Spacer.BottomScreen />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Row = styled.View({ flexDirection: 'row' })

const TypoTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
})

const CenteredContainer = styled.View({
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginHorizontal: getSpacing(8),
})

const ButtonContainer = styled.View({ flex: 1, maxWidth: getSpacing(44) })
const TextContainer = styled.View({ maxWidth: getSpacing(88) })

const CenteredText = styled.Text({
  textAlign: 'center',
})
