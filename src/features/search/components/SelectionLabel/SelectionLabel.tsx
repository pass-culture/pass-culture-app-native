import React from 'react'
import styled from 'styled-components/native'

import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'
import { HiddenCheckbox } from 'ui/web/inputs/HiddenCheckbox'

interface Props {
  label: string
  selected: boolean
  onPress: () => void
  children?: never
}

export const SelectionLabel: React.FC<Props> = ({ label, selected, onPress }) => {
  return (
    <StyledTouchableOpacity
      selected={selected}
      {...accessibleCheckboxProps({ checked: selected, label })}
      onPress={onPress}>
      {selected ? (
        <IconContainer>
          <ValidateWhite />
        </IconContainer>
      ) : undefined}
      <Label numberOfLines={1} selected={selected}>
        {label}
      </Label>
      <HiddenCheckbox name={label} checked={selected} accessibilityLabel={label} />
    </StyledTouchableOpacity>
  )
}

const ValidateWhite = styled(Validate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.lockedInverted,
  size: theme.icons.sizes.smaller,
}))``

const IconContainer = styled.View({
  width: getSpacing(8),
  paddingHorizontal: getSpacing(1),
})

const StyledTouchableOpacity = styled(TouchableOpacity)<{ selected: boolean }>(
  ({ selected, theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: getSpacing(10),
    borderWidth: 2,
    borderColor: selected
      ? theme.designSystem.color.border.brandPrimary
      : theme.designSystem.color.border.default,
    marginBottom: getSpacing(3),
    marginRight: getSpacing(3),
    backgroundColor: selected
      ? theme.designSystem.color.background.brandPrimary
      : theme.designSystem.color.background.default,
    maxWidth: theme.buttons.maxWidth,
    alignSelf: 'flex-start',
  })
)

const Label = styled(Typo.BodyAccent)<{ selected: boolean }>(({ theme, selected }) => ({
  marginLeft: selected ? undefined : getSpacing(5),
  marginRight: selected ? getSpacing(2) : getSpacing(5),
  marginVertical: getSpacing(2.5),
  color: selected ? theme.designSystem.color.text.inverted : theme.designSystem.color.text.default,
}))
