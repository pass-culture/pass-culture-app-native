import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { SignupStep } from 'features/auth/signup/enums'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Error } from 'ui/svg/icons/Error'
import { ColorsEnum, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  signupStep: SignupStep
  resume: () => void
  testIdSuffix?: string
}

export const QuitSignupModal: FunctionComponent<Props> = ({
  visible,
  resume,
  testIdSuffix,
  signupStep,
}) => {
  function quitSignup() {
    analytics.logCancelSignup(signupStep)
    navigateToHome()
  }

  const title = t`Veux-tu abandonner l'inscription\u00a0?`
  const description = t`Les informations que tu as renseignées ne seront pas enregistrées.`

  return (
    <AppFullPageModal visible={visible} testIdSuffix={testIdSuffix}>
      <GenericInfoPage
        title={title}
        icon={Error}
        flex={false}
        buttons={[
          <ButtonPrimaryWhite key={1} title={t`Continuer l'inscription`} onPress={resume} />,
          <ButtonTertiaryWhite key={2} title={t`Abandonner l'inscription`} onPress={quitSignup} />,
        ]}>
        <StyledBody>{description}</StyledBody>
        <Spacer.Column numberOfSpaces={8} />
      </GenericInfoPage>
    </AppFullPageModal>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
