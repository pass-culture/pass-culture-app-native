import { t } from '@lingui/macro'
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
  return (
    <React.Fragment>
      <PageHeader title={t`Profil`} size="medium" />
      <Spacer.Column numberOfSpaces={6} />
      <ContentContainer>
        <StyledBody>
          {t`Tu as entre 15 et 18 ans\u00a0? Crée-toi un compte pour bénéficier de ton crédit pass Culture`}
        </StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <TouchableLink
          as={ButtonPrimary}
          testID="S'inscrire"
          wording={t`S'inscrire`}
          navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
          onPress={() => {
            analytics.logProfilSignUp()
          }}
        />
        <Spacer.Column numberOfSpaces={5} />
        <StyledBody>
          {t`Tu as déjà un compte\u00a0?` + '\u00a0'}
          <TouchableLink
            as={ButtonInsideText}
            navigateTo={{ screen: 'Login', params: { preventCancellation: true } }}
            wording={t`Connecte-toi`}
            icon={Connect}
            {...accessibilityAndTestId(t`Connecte-toi`)}
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
