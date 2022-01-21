import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface Props {
  selected: boolean
  description?: string | null
  name: string
  onPress: (name: string) => void
}

export const RadioButton = ({ name, description, selected, onPress }: Props) => (
  <Label selected={selected} onPress={() => onPress(name)}>
    <TextContainer>
      <Typo.ButtonText color={selected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK}>
        {name}
      </Typo.ButtonText>
      {description ? <Typo.Caption color={ColorsEnum.GREY_DARK}>{description}</Typo.Caption> : null}
    </TextContainer>
    {selected ? (
      <IconContainer>
        <Validate color={ColorsEnum.PRIMARY} size={24} />
      </IconContainer>
    ) : null}
  </Label>
)

const Label = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<{ selected: boolean }>(({ theme, selected }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderColor: selected ? theme.colors.primary : theme.colors.greyMedium,
  borderRadius: theme.borderRadius.button,
  borderWidth: 1,
  marginBottom: getSpacing(4),
  width: '100%',
  height: getSpacing(12),
}))

const TextContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const IconContainer = styled.View({
  position: 'absolute',
  right: getSpacing(3),
})
