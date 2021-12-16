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
import { Spacer } from 'ui/components/spacer/Spacer'
import { WarningDeprecated } from 'ui/svg/icons/Warning_deprecated'
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
    <AppFullPageModal visible={visible} testIdSuffix={testIdSuffix}>
      <GenericInfoPage title={title} icon={WarningDeprecated} flex={false}>
        <StyledBody>{description}</StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimaryWhite title={t`Continuer la vérification`} onPress={continueIdentityCheck} />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryWhite title={t`Abandonner la vérification`} onPress={quitIdentityCheck} />
      </GenericInfoPage>
    </AppFullPageModal>
  )
}

const StyledBody = styled(Typo.Body)(({ theme, color }) => ({
  color: color ?? theme.colors.white,
  textAlign: 'center',
}))
