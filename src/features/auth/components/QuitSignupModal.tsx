import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, Typo } from 'ui/theme'

export enum SignupSteps {
  Email = 'Email',
  Password = 'Password',
  Birthday = 'Birthday',
  PostalCode = 'PostalCode',
  CGU = 'CGU',
  PhoneNumber = 'PhoneNumber',
  RedactorEmail = 'RedactorEmail',
  RedactorPassword = 'RedactorPassword',
  RedactorCGU = 'RedactorCGU',
}

interface Props {
  visible: boolean
  signupStep: SignupSteps
  resume: () => void
  testIdSuffix?: string
  isRedactor?: boolean
}

export const QuitSignupModal: FunctionComponent<Props> = ({
  visible,
  resume,
  testIdSuffix,
  signupStep,
  isRedactor,
}) => {
  function quitSignup() {
    analytics.logCancelSignup(signupStep)
    navigateToHome()
  }

  const title = isRedactor
    ? t`Voulez-vous abandonner l'inscription ?`
    : t`Veux-tu abandonner l'inscription ?`

  const description = isRedactor
    ? t`Les informations que vous avez renseignées ne seront pas enregistrées.`
    : t`Les informations que tu as renseignées ne seront pas enregistrées.`

  return (
    <AppFullPageModal visible={visible} testIdSuffix={testIdSuffix}>
      <GenericInfoPage title={title} icon={Warning}>
        <StyledBody>{description}</StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimaryWhite title={t`Continuer l'inscription`} onPress={resume} />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryWhite title={t`Abandonner l'inscription`} onPress={quitSignup} />
      </GenericInfoPage>
    </AppFullPageModal>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
