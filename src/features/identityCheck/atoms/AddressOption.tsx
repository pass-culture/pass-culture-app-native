import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { ValidateDeprecated as Validate } from 'ui/svg/icons/Validate_deprecated'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  onPressOption: (optionKey: string) => void
  optionKey: string
  label: string
  selected: boolean
}

const ICON_SIZE = getSpacing(8)

export const AddressOption = ({ optionKey, label, onPressOption, selected }: Props) => {
  return (
    <Container>
      <StyledTouchableOpacity
        onPress={() => onPressOption(optionKey)}
        activeOpacity={ACTIVE_OPACITY}>
        <TextContainer>
          <StyledBody selected={selected}>{label}</StyledBody>
          <IconContainer>
            {!!selected && <Validate color={ColorsEnum.PRIMARY} size={ICON_SIZE} />}
          </IconContainer>
        </TextContainer>
      </StyledTouchableOpacity>
      <Separator />
    </Container>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(4),
})

const StyledTouchableOpacity = styled.TouchableOpacity({
  flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingVertical: getSpacing(3),
})

const TextContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
})

const StyledBody = styled(Typo.Body)<{ selected: boolean }>(({ selected }) => ({
  fontWeight: selected ? 'bold' : 'normal',
  flex: 1,
}))

const IconContainer = styled.View({
  width: ICON_SIZE,
  height: ICON_SIZE,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: getSpacing(2),
})
