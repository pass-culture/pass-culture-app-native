import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { SignupStep } from 'features/auth/enums'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { BicolorError } from 'ui/svg/icons/BicolorError'
import { Clear } from 'ui/svg/icons/Clear'
import { Typo } from 'ui/theme'

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
  const quitSignup = useCallback(() => {
    analytics.logCancelSignup(signupStep)
    resume()
    navigateToHome()
  }, [resume, signupStep])

  const continueSignup = useCallback(() => {
    analytics.logContinueSignup()
    resume()
  }, [resume])

  const title = 'Veux-tu abandonner l’inscription\u00a0?'
  const description = 'Les informations que tu as renseignées ne seront pas enregistrées.'

  return (
    <AppFullPageModal visible={visible} testIdSuffix={testIdSuffix} onRequestClose={continueSignup}>
      <GenericInfoPage
        title={title}
        icon={ErrorIllustration}
        flex={false}
        buttons={[
          <ButtonPrimaryWhite key={1} wording="Continuer l’inscription" onPress={continueSignup} />,
          <ButtonTertiaryWhite
            key={2}
            wording="Abandonner l’inscription"
            onPress={quitSignup}
            icon={Clear}
          />,
        ]}>
        <StyledBody>{description}</StyledBody>
        <Spacer.Column numberOfSpaces={8} />
      </GenericInfoPage>
    </AppFullPageModal>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const ErrorIllustration = styled(BicolorError).attrs(({ theme }) => ({
  color: theme.colors.white,
  color2: theme.colors.white,
}))``
