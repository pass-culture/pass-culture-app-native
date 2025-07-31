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
  color: theme.designSystem.color.icon.inverted,
  size: theme.icons.sizes.smaller,
}))``

const IconContainer = styled.View(({ theme }) => ({
  width: theme.designSystem.size.spacing.xxl,
  paddingHorizontal: theme.designSystem.size.spacing.xs,
}))

const StyledTouchableOpacity = styled(TouchableOpacity)<{ selected: boolean }>(
  ({ selected, theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.designSystem.size.spacing.xxxl,
    borderWidth: 2,
    borderColor: selected
      ? theme.designSystem.color.border.brandPrimary
      : theme.designSystem.color.border.default,
    marginBottom: theme.designSystem.size.spacing.m,
    marginRight: theme.designSystem.size.spacing.m,
    backgroundColor: selected
      ? theme.designSystem.color.background.brandPrimary
      : theme.designSystem.color.background.default,
    maxWidth: theme.buttons.maxWidth,
    alignSelf: 'flex-start',
  })
)

const Label = styled(Typo.BodyAccent)<{ selected: boolean }>(({ theme, selected }) => ({
  marginLeft: selected ? undefined : getSpacing(5),
  marginRight: selected ? theme.designSystem.size.spacing.s : getSpacing(5),
  marginVertical: getSpacing(2.5),
  color: selected ? theme.designSystem.color.text.inverted : theme.designSystem.color.text.default,
}))
