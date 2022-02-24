import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { Typo } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
  testIdSuffix?: string
}

const title = t`Veux-tu abandonner la vérification d'identité\u00a0?`
const description = t`Les informations que tu as renseignées ne seront pas enregistrées.`

export const QuitIdentityCheckModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  testIdSuffix,
}) => {
  const context = useIdentityCheckContext()

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
        title={title}
        icon={ErrorIllustration}
        flex={false}
        buttons={[
          <ButtonPrimaryWhite
            key={1}
            wording={t`Continuer la vérification`}
            onPress={continueIdentityCheck}
          />,
          <ButtonTertiaryWhite
            key={2}
            wording={t`Abandonner la vérification`}
            onPress={quitIdentityCheck}
          />,
        ]}>
        <StyledBody>{description}</StyledBody>
      </GenericInfoPage>
    </AppFullPageModal>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
