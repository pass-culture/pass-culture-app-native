import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/DMSModal'
import { analytics } from 'libs/analytics'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { Plus } from 'ui/svg/icons/Plus'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

const DMScaption = t`Si tu n’es pas en mesure de prendre en photo ta pièce d’identité, tu peux transmettre un autre document via le site Démarches-Simplifiées`

export const DMSInformation = () => {
  const { visible, showModal, hideModal } = useModal(false)

  const showDMSModal = () => {
    analytics.logStartDMSTransmission()
    showModal()
  }

  return (
    <React.Fragment>
      <Background>
        <Typo.Caption color={ColorsEnum.GREY_DARK}>{DMScaption}</Typo.Caption>
        <ButtonQuaternaryBlack
          title={t`Transmettre un document`}
          onPress={showDMSModal}
          icon={Plus}
        />
      </Background>
      <DMSModal visible={visible} hideModal={hideModal} />
    </React.Fragment>
  )
}

const Background = styled.View(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.colors.greyLight,
  paddingTop: getSpacing(4),
  paddingHorizontal: getSpacing(4),
  paddingBottom: getSpacing(2),
  borderRadius: theme.borderRadius.checkbox,
}))
