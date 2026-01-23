import React from 'react'
import styled from 'styled-components/native'

import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { Separator } from 'ui/components/Separator'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  onPressOption: (optionKey: string) => void
  optionKey: string
  label: string
  selected: boolean
  accessibilityLabel: string
}

export const AddressOption = ({
  optionKey,
  label,
  onPressOption,
  selected,
  accessibilityLabel,
}: Props) => {
  return (
    <Container>
      <StyledTouchableOpacity
        {...accessibleRadioProps({ checked: selected, label: accessibilityLabel })}
        onPress={() => onPressOption(optionKey)}>
        <TextContainer>
          <StyledBody selected={selected}>{label}</StyledBody>
          <IconContainer>{selected ? <Validate /> : null}</IconContainer>
        </TextContainer>
      </StyledTouchableOpacity>
      <Separator.Horizontal />
    </Container>
  )
}

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  color2: theme.designSystem.color.icon.inverted,
  size: theme.icons.sizes.small,
}))``

const Container = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.l,
}))

const StyledTouchableOpacity = styled(TouchableOpacity)(({ theme }) => ({
  flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingVertical: theme.designSystem.size.spacing.m,
}))

const TextContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
})

const StyledBody = styled(Typo.Body)<{ selected: boolean }>(({ theme, selected }) => ({
  fontWeight: selected ? 'bold' : 'normal',
  flex: theme.isMobileViewport ? 1 : undefined,
}))

const IconContainer = styled.View(({ theme }) => ({
  width: theme.icons.sizes.small,
  height: theme.icons.sizes.small,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: getSpacing(theme.isMobileViewport ? 2 : 6),
}))
