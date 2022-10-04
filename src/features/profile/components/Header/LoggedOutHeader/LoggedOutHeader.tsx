import React from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Connect } from 'ui/svg/icons/Connect'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export function LoggedOutHeader() {
  return (
    <React.Fragment>
      <PageHeader title="Mon profil" size="medium" />
      <Container>
        <Typo.Body>Tu as entre 15 et 18 ans&nbsp;?</Typo.Body>
        <Spacer.Column numberOfSpaces={5} />
        <GreyContainer>
          <Typo.Body>Crée-toi un compte pour bénéficier de ton crédit pass Culture</Typo.Body>
          <Spacer.Column numberOfSpaces={5} />
          <TouchableLink
            as={ButtonWithLinearGradient}
            wording="Créer un compte"
            navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
            onPress={() => analytics.logProfilSignUp()}
          />
          <Spacer.Column numberOfSpaces={5} />
          <StyledBody>
            Déjà un compte&nbsp;?&nbsp;
            <TouchableLink
              as={StyledButtonInsideText}
              navigateTo={{ screen: 'Login', params: { preventCancellation: true } }}
              wording="Se connecter"
              icon={Connect}
            />
          </StyledBody>
        </GreyContainer>
      </Container>
      <Spacer.Column numberOfSpaces={2} />
    </React.Fragment>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(6),
})

const GreyContainer = styled.View(({ theme }) => ({
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
}))

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  color: theme.colors.secondary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
