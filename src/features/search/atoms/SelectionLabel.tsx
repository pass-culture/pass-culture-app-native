import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const SelectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <TouchableOpacity>
    <Label>{label}</Label>
  </TouchableOpacity>
)

const TouchableOpacity = styled.TouchableOpacity({
  borderRadius: getSpacing(6),
  borderWidth: 2,
  borderColor: ColorsEnum.GREY_MEDIUM,
  marginBottom: getSpacing(3),
  marginRight: getSpacing(3),
})
const Label = styled(Typo.ButtonText)({
  paddingVertical: getSpacing(2.5),
  paddingHorizontal: getSpacing(4),
})
