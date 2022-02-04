import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'
interface Props {
  onPressOption: (optionKey: string) => void
  optionKey: string
  label: string
  selected: boolean
}

export const AddressOption = ({ optionKey, label, onPressOption, selected }: Props) => {
  return (
    <Container>
      <TouchableOpacity onPress={() => onPressOption(optionKey)}>
        <TextContainer>
          <StyledBody selected={selected}>{label}</StyledBody>
          <IconContainer>{!!selected && <Validate />}</IconContainer>
        </TextContainer>
      </TouchableOpacity>
      <Separator />
    </Container>
  )
}

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

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

const IconContainer = styled.View(({ theme }) => ({
  width: theme.icons.sizes.small,
  height: theme.icons.sizes.small,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: getSpacing(2),
}))
