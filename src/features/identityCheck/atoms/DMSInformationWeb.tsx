import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/DMSModal'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export const DMSInformationWeb = () => {
  const { visible, showModal, hideModal } = useModal(false)

  const showDMSModal = () => {
    analytics.logStartDMSTransmission()
    showModal()
  }

  return (
    <React.Fragment>
      <Container>
        <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Tu n'as pas de smartphone\u00a0?`}</Typo.Body>
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack
          title={t`Identification par le site Démarches-Simplifiées`}
          onPress={showDMSModal}
          icon={ExternalSiteFilled}
        />
        <Typo.Caption color={ColorsEnum.GREY_DARK}>{t`Environ 10 jours`}</Typo.Caption>
      </Container>
      <DMSModal visible={visible} hideModal={hideModal} />
    </React.Fragment>
  )
}

const Container = styled.View({
  alignItems: 'center',
  display: 'flex',
})
