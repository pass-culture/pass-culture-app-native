import React from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/firebase/analytics'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Connect } from 'ui/svg/icons/Connect'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export function LoggedOutHeader() {
  const loginText = 'Tu as déjà un compte\u00a0?\u00a0'
  return (
    <React.Fragment>
      <PageHeader title="Profil" size="medium" />
      <Spacer.Column numberOfSpaces={6} />
      <ContentContainer>
        <StyledBody>
          Tu as entre 15 et 18 ans&nbsp;? Crée-toi un compte pour bénéficier de ton crédit pass
          Culture
        </StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <TouchableLink
          as={ButtonPrimary}
          testID="S’inscrire"
          wording="S’inscrire"
          navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
          onPress={() => {
            analytics.logProfilSignUp()
          }}
        />
        <Spacer.Column numberOfSpaces={5} />
        <StyledBody>
          {loginText}
          <TouchableLink
            as={ButtonInsideText}
            navigateTo={{ screen: 'Login', params: { preventCancellation: true } }}
            wording="Connecte-toi"
            icon={Connect}
            {...accessibilityAndTestId('Connecte-toi')}
          />
        </StyledBody>
      </ContentContainer>
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const ContentContainer = styled.View({
  alignItems: 'center',
  paddingHorizontal: getSpacing(6),
  width: '100%',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
