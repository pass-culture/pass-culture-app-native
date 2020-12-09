import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { NavigateToHomeWithoutModalOptions } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  resume: () => void
  testIdSuffix?: string
}

export const QuitSignupModal: FunctionComponent<Props> = ({ visible, resume, testIdSuffix }) => {
  const { navigate } = useNavigation<UseNavigationType>()

  function quitSignup() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }

  return (
    <AppFullPageModal visible={visible} testIdSuffix={testIdSuffix}>
      <GenericInfoPage title={_(t`Es-tu sûr de vouloir abandonner l'inscription ?`)} icon={Warning}>
        <StyledBody>
          {_(t`Les informations que tu as enregistrées ne seront pas enregistrées`)}
        </StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimaryWhite title={_(t`Continuer l'inscription`)} onPress={resume} />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryWhite title={_(t`Abandonner l'inscription`)} onPress={quitSignup} />
      </GenericInfoPage>
    </AppFullPageModal>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
