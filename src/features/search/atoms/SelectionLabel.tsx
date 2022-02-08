import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { HiddenCheckbox } from 'ui/web/inputs/HiddenCheckbox'

interface Props {
  label: string
  selected: boolean
  onPress: () => void
}

export const SelectionLabel: React.FC<Props> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity selected={selected} onPress={onPress}>
      {selected ? (
        <IconContainer>
          <ValidateWhite />
        </IconContainer>
      ) : (
        <Spacer.Row numberOfSpaces={5} />
      )}
      <Label selected={selected}>{label}</Label>
      <Spacer.Row numberOfSpaces={selected ? 2 : 5} />
      <HiddenCheckbox name={label} checked={selected} accessibilityLabel={label} />
    </TouchableOpacity>
  )
}

const ValidateWhite = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: getSpacing(4.5),
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
const Label = styled(Typo.ButtonText)<{ selected: boolean }>(({ theme, selected }) => ({
  paddingVertical: getSpacing(2.5),
  color: selected ? theme.colors.white : theme.colors.black,
}))
