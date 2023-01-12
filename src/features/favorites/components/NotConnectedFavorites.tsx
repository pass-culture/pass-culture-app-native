import React from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorUserFavorite } from 'ui/svg/icons/BicolorUserFavorite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NotConnectedFavorites = () => {
  return (
    <Container>
      <Spacer.TopScreen />
      <Spacer.Flex />
      <StyledUserFavorite />
      <CenteredContainer>
        <StyledTitle4>Connecte-toi pour profiter de cette fonctionnalité&nbsp;!</StyledTitle4>
        <Spacer.Column numberOfSpaces={4} />

        <TextContainer>
          <CenteredText>
            <StyledBody>
              Ton compte te permettra de retrouver tous tes favoris en un clin d’oeil&nbsp;!
            </StyledBody>
          </CenteredText>
        </TextContainer>
      </CenteredContainer>

      <Row>
        <ButtonContainer>
          <InternalTouchableLink
            as={ButtonWithLinearGradient}
            wording="S’inscrire"
            navigateTo={{ screen: 'SignupForm' }}
            onBeforeNavigate={analytics.logSignUpFromFavorite}
            buttonHeight="tall"
          />
          <Spacer.Column numberOfSpaces={4} />
          <InternalTouchableLink
            as={ButtonTertiaryWhite}
            wording="Se connecter"
            navigateTo={{ screen: 'Login' }}
            onBeforeNavigate={analytics.logSignInFromFavorite}
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

const StyledUserFavorite = styled(BicolorUserFavorite).attrs(({ theme }) => ({
  color: theme.colors.white,
  color2: theme.colors.white,
  size: theme.illustrations.sizes.fullPage,
}))``

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Row = styled.View({ flexDirection: 'row' })

const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.black,
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

const CenteredText = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))
