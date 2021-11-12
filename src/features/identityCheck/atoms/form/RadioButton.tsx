import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

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
        <Validate color={ColorsEnum.PRIMARY} />
      </IconContainer>
    ) : null}
  </Label>
)

const Label = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))<{ selected: boolean }>(({ selected }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderColor: selected ? ColorsEnum.PRIMARY : ColorsEnum.GREY_MEDIUM,
  borderRadius: BorderRadiusEnum.BUTTON,
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
