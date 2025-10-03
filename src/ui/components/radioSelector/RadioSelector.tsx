import React from 'react'
import styled from 'styled-components/native'

import { SelectableListItem } from 'features/offer/components/SelectableListItem/SelectableListItem'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { Typo } from 'ui/theme'

type RightContentProps =
  | { rightText: string; rightElement?: never }
  | { rightText?: never; rightElement: React.ReactNode }
  | { rightText?: never; rightElement?: never }

interface BaseRadioSelectorProps {
  label: string
  radioGroupLabel: string
  onPress: VoidFunction
  checked: boolean
  description?: string | null
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
}

type RadioSelectorProps = BaseRadioSelectorProps & RightContentProps

export const RadioSelector = ({
  label,
  onPress,
  description,
  rightText,
  rightElement,
  checked,
  disabled,
  testID,
  accessibilityLabel,
  radioGroupLabel,
}: RadioSelectorProps) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()

  const handlePress = () => {
    if (disabled) return
    onPress()
  }

  useSpaceBarAction(isFocus ? handlePress : undefined)

  const checkedStatus = checked ? 'sélectionné' : 'non sélectionné'
  const computedAccessibilityLabel = accessibilityLabel
    ? `${radioGroupLabel} - ${accessibilityLabel} - ${checkedStatus}`
    : description
      ? `${radioGroupLabel} - ${label} - ${description} - ${checkedStatus}`
      : `${radioGroupLabel} - ${label} - ${checkedStatus}`

  return (
    <SelectableListItem
      {...accessibleRadioProps({ label: computedAccessibilityLabel, checked })}
      onSelect={handlePress}
      render={({ isHover }) => (
        <Container gap={4}>
          <LeftContent>
            <Label
              disabled={disabled}
              testID={testID ? `${testID}-label` : undefined}
              isHover={isHover}>
              {label}
            </Label>
            {
              description ? (
                <Description disabled={disabled}>{description}</Description>
              ) : null /* conditionally render description since it applies a margin even when nothing is displayed */
            }
          </LeftContent>
          <RightContent>
            {rightText ? (
              <RightText disabled={disabled} testID={testID ? `${testID}-right-text` : undefined}>
                {rightText}
              </RightText>
            ) : null}
            {rightElement}
          </RightContent>
        </Container>
      )}
      isSelected={checked}
      disabled={disabled}
      testID={testID}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

const Container = styled(ViewGap)({
  alignItems: 'center',
  flexDirection: 'row',
})

const LeftContent = styled.View({
  flex: 1,
})

const RightContent = styled.View({})

const Label = styled(Typo.BodyAccent)<{ isHover?: boolean }>(({ theme, disabled, isHover }) => ({
  color: disabled ? theme.designSystem.color.text.disabled : undefined,
  textDecoration: isHover ? 'underline' : undefined,
}))

const Description = styled(Typo.BodyAccentXs)<{ isHover?: boolean }>(
  ({ theme, disabled, isHover }) => ({
    marginTop: theme.designSystem.size.spacing.xs,
    color: disabled ? theme.designSystem.color.text.disabled : theme.designSystem.color.text.subtle,
    textDecoration: isHover ? 'underline' : undefined,
  })
)

const RightText = styled(Typo.Body)(({ theme, disabled }) => ({
  color: disabled ? theme.designSystem.color.text.disabled : theme.designSystem.color.text.default,
}))
