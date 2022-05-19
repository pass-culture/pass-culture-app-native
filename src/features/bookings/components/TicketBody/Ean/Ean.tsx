import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

type Props = {
  isbn: string
}

export const Ean: FunctionComponent<Props> = ({ isbn }) => (
  <EANContainer testID="ean">
    <Typo.Caption>{t`EAN` + '\u00a0'}</Typo.Caption>
    <DarkGreyCaption>{isbn}</DarkGreyCaption>
  </EANContainer>
)

const EANContainer = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})

const DarkGreyCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
