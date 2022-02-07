import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { Background } from 'ui/svg/Background'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NotConnectedFavorites = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <Container>
      <Background />
      <Spacer.TopScreen />
      <Spacer.Flex />
      <StyledUserFavorite />
      <CenteredContainer>
        <TypoTitle4>{t`Connecte-toi pour profiter de cette fonctionnalité\u00a0!`}</TypoTitle4>
        <Spacer.Column numberOfSpaces={4} />

        <TextContainer>
          <CenteredText>
            <Body>
              {t`Ton compte te permettra de retrouver tous tes favoris en un clin d'oeil\u00a0!`}
            </Body>
          </CenteredText>
        </TextContainer>
      </CenteredContainer>

      <Row>
        <ButtonContainer>
          <ButtonPrimaryWhite
            wording={t`S'inscrire`}
            onPress={() => navigate('SignupForm')}
            buttonHeight="tall"
          />
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiaryWhite
            wording={t`Se connecter`}
            onPress={() => navigate('Login')}
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

const StyledUserFavorite = styled(UserFavorite).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.illustrations.sizes.fullPage,
}))``

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Row = styled.View({ flexDirection: 'row' })

const TypoTitle4 = styled(Typo.Title4)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))

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

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
