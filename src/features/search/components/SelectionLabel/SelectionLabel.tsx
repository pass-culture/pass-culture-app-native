import React from 'react'
import styled from 'styled-components/native'

import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Validate } from 'ui/svg/icons/Validate'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'
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
      onPress={onPress}
      {...accessibleCheckboxProps({ checked: selected, label })}>
      {selected ? (
        <IconContainer>
          <ValidateWhite />
        </IconContainer>
      ) : undefined}
      <LabelContainer selected={selected}>
        <Label {...setTextSemantic('span')} numberOfLines={1} selected={selected}>
          {label}
        </Label>
      </LabelContainer>
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
    borderRadius: theme.designSystem.size.borderRadius.pill,
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

const LabelContainer = styled.View<{ selected: boolean }>(({ theme, selected }) => ({
  marginLeft: selected ? undefined : theme.designSystem.size.spacing.xl,
  marginRight: selected ? theme.designSystem.size.spacing.s : theme.designSystem.size.spacing.xl,
  marginVertical: theme.designSystem.size.spacing.m,
  flex: 1,
  minWidth: 0,
}))

const Label = styled(Typo.BodyAccent)<{ selected: boolean }>(({ theme, selected }) => ({
  color: selected ? theme.designSystem.color.text.inverted : theme.designSystem.color.text.default,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
}))
