import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Plus } from 'ui/svg/icons/Plus'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const DMScaption = t`Si tu n’es pas en mesure de prendre en photo ta pièce d’identité, tu peux transmettre un autre document via le site Démarches-Simplifiées`

export const DMSInformation = () => (
  <Background>
    <Typo.Caption color={ColorsEnum.GREY_DARK}>{DMScaption}</Typo.Caption>
    <OtherDocumentContainer>
      <Plus color={ColorsEnum.BLACK} size={getSpacing(4)} />
      <Spacer.Row numberOfSpaces={1} />
      <Typo.Caption color={ColorsEnum.BLACK}>{t`Transmettre un document`}</Typo.Caption>
    </OtherDocumentContainer>
  </Background>
)

const OtherDocumentContainer = styled.View({
  paddingTop: getSpacing(2),
  flexDirection: 'row',
  alignItems: 'center',
})

const Background = styled.View(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(4),
  borderRadius: theme.borderRadius.checkbox,
}))
