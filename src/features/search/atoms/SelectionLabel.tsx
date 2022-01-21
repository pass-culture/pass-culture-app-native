import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  label: string
  selected: boolean
  onPress: () => void
}

export const SelectionLabel: React.FC<Props> = ({ label, selected, onPress }) => (
  <TouchableOpacity selected={selected} onPress={onPress}>
    {selected ? (
      <IconContainer>
        <Validate color={ColorsEnum.WHITE} size={getSpacing(4.5)} />
      </IconContainer>
    ) : (
      <Spacer.Row numberOfSpaces={5} />
    )}
    <Label color={selected ? ColorsEnum.WHITE : ColorsEnum.BLACK}>{label}</Label>
    <Spacer.Row numberOfSpaces={selected ? 2 : 5} />
  </TouchableOpacity>
)

const IconContainer = styled.View({
  width: getSpacing(8),
  paddingHorizontal: getSpacing(1),
})

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<{ selected: boolean }>(({ selected }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: getSpacing(10),
  borderWidth: 2,
  borderColor: selected ? ColorsEnum.PRIMARY : ColorsEnum.GREY_MEDIUM,
  marginBottom: getSpacing(3),
  marginRight: getSpacing(3),
  backgroundColor: selected ? ColorsEnum.PRIMARY : ColorsEnum.WHITE,
}))
const Label = styled(Typo.ButtonText)({ paddingVertical: getSpacing(2.5) })
