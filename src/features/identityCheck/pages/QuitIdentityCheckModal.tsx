import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { WarningDeprecated } from 'ui/svg/icons/Warning_deprecated'
import { ColorsEnum, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  resume: () => void
  testIdSuffix?: string
}

export const QuitIdentityCheckModal: FunctionComponent<Props> = ({
  visible,
  resume,
  testIdSuffix,
}) => {
  const title = t`Veux-tu abandonner la vérification d'identité ?`
  const description = t`Les informations que tu as renseignées ne seront pas enregistrées.`
  return (
    <AppFullPageModal visible={visible} testIdSuffix={testIdSuffix}>
      <GenericInfoPage title={title} icon={WarningDeprecated} flex={false}>
        <StyledBody>{description}</StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimaryWhite title={t`Continuer la vérification`} onPress={resume} />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryWhite title={t`Abandonner la vérification`} onPress={navigateToHome} />
      </GenericInfoPage>
    </AppFullPageModal>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
