import React from 'react'
import styled from 'styled-components/native'

import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
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
      ) : (
        <Spacer.Row numberOfSpaces={5} />
      )}
      <Label numberOfLines={1} selected={selected}>
        {label}
      </Label>
      <Spacer.Row numberOfSpaces={selected ? 2 : 5} />
      <HiddenCheckbox name={label} checked={selected} accessibilityLabel={label} />
    </StyledTouchableOpacity>
  )
}

const ValidateWhite = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.white,
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
  marginVertical: getSpacing(2.5),
  color: selected ? theme.colors.white : theme.colors.black,
}))
