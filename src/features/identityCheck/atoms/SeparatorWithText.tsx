import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const SeparatorWithText = ({ texte }: { texte: string }) => (
  <SeparatorContainer>
    <Separator />
    <StyledCaption>{texte}</StyledCaption>
    <Separator />
  </SeparatorContainer>
)

const SeparatorContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})

const Separator = styled.View({
  flex: 1,
  height: 1,
  backgroundColor: ColorsEnum.GREY_MEDIUM,
})

const StyledCaption = styled(Typo.Caption).attrs({
  color: ColorsEnum.GREY_DARK,
})({
  paddingHorizontal: getSpacing(4),
})
