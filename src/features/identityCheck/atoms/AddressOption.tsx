import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
interface Props {
  onPressOption: (optionKey: string) => void
  optionKey: string
  label: string
  selected: boolean
}

const ICON_SIZE = getSpacing(6)

export const AddressOption = ({ optionKey, label, onPressOption, selected }: Props) => {
  return (
    <Container>
      <TouchableOpacity onPress={() => onPressOption(optionKey)}>
        <TextContainer>
          <StyledBody selected={selected}>{label}</StyledBody>
          <IconContainer>
            {!!selected && <Validate color={ColorsEnum.PRIMARY} size={ICON_SIZE} />}
          </IconContainer>
        </TextContainer>
      </TouchableOpacity>
      <Separator />
    </Container>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(4),
})

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
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
