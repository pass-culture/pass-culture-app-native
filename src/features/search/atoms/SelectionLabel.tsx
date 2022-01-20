import React from 'react'
import styled from 'styled-components/native'

import { Validate as ValidateDefault } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  label: string
  selected: boolean
  onPress: () => void
}

export const SelectionLabel: React.FC<Props> = ({ label, selected, onPress }) => (
  <TouchableOpacity selected={selected} onPress={onPress}>
    {selected ? (
      <IconContainer>
        <Validate />
      </IconContainer>
    ) : (
      <Spacer.Row numberOfSpaces={5} />
    )}
    <Label selected={selected}>{label}</Label>
    <Spacer.Row numberOfSpaces={selected ? 2 : 5} />
  </TouchableOpacity>
)

const Validate = styled(ValidateDefault).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: getSpacing(4.5), // TODO: see with UXs why this icon is not a theme size
}))``

const IconContainer = styled.View({
  width: getSpacing(8),
  paddingHorizontal: getSpacing(1),
})

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<{ selected: boolean }>(({ selected, theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: getSpacing(10),
  borderWidth: 2,
  borderColor: selected ? theme.colors.primary : theme.colors.greyMedium,
  marginBottom: getSpacing(3),
  marginRight: getSpacing(3),
  backgroundColor: selected ? theme.colors.primary : theme.colors.white,
}))

const Label = styled(Typo.ButtonText)<{ selected: boolean }>(({ selected, theme }) => ({
  color: selected ? theme.colors.white : theme.colors.black,
  paddingVertical: getSpacing(2.5),
}))
