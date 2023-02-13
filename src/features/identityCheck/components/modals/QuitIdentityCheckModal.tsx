import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { BicolorError } from 'ui/svg/icons/BicolorError'
import { Clear } from 'ui/svg/icons/Clear'
import { Typo } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
  testIdSuffix?: string
}

export const QuitIdentityCheckModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  testIdSuffix,
}) => {
  const context = useSubscriptionContext()

  function quitIdentityCheck() {
    if (context.step) analytics.logConfirmQuitIdentityCheck(context.step)
    hideModal()
    navigateToHome()
  }

  function continueIdentityCheck() {
    analytics.logContinueIdentityCheck()
    hideModal()
  }

  return (
    <AppFullPageModal
      visible={visible}
      testIdSuffix={testIdSuffix}
      onRequestClose={continueIdentityCheck}>
      <GenericInfoPage
        title="Veux-tu abandonner la vérification d’identité&nbsp;?"
        icon={ErrorIllustration}
        flex={false}
        buttons={[
          <ButtonPrimaryWhite
            key={1}
            wording="Continuer la vérification"
            onPress={continueIdentityCheck}
          />,
          <ButtonTertiaryWhite
            key={2}
            wording="Abandonner la vérification"
            onPress={quitIdentityCheck}
            icon={Clear}
          />,
        ]}>
        <StyledBody>Les informations que tu as renseignées ne seront pas enregistrées.</StyledBody>
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
