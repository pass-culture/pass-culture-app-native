import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
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
        accessibilityRole={AccessibilityRole.RADIO}
        accessibilityState={{ checked: selected }}
        onPress={() => onPressOption(optionKey)}
        accessibilityLabel={accessibilityLabel}>
        <TextContainer>
          <StyledBody selected={selected}>{label}</StyledBody>
          <IconContainer>{!!selected && <Validate />}</IconContainer>
        </TextContainer>
      </StyledTouchableOpacity>
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

const StyledTouchableOpacity = styled(TouchableOpacity)({
  flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingVertical: getSpacing(3),
})

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
