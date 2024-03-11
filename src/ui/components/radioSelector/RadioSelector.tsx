import React from 'react'
import styled from 'styled-components/native'

import { SelectableListItem } from 'features/offerv2/components/SelectableListItem/SelectableListItem'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { getSpacing, Typo } from 'ui/theme'

interface RadioSelectorProps {
  label: string
  onPress: VoidFunction
  checked: boolean
  description?: string | null
  rightText?: string
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
}

export const RadioSelector = ({
  label,
  onPress,
  description,
  rightText,
  checked,
  disabled,
  testID,
  accessibilityLabel,
}: RadioSelectorProps) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()

  const handlePress = () => {
    if (disabled) {
      return
    }
    onPress()
  }

  useSpaceBarAction(isFocus ? handlePress : undefined)

  return (
    <SelectableListItem
      {...accessibleRadioProps({ label: accessibilityLabel ?? label, checked })}
      onSelect={handlePress}
      render={({ isHover }) => (
        <Container>
          <LeftContent>
            <Label disabled={disabled} testID={`${testID}-label`} isHover={isHover}>
              {label}
            </Label>
            {
              description ? (
                <Description disabled={disabled}>{description}</Description>
              ) : null /* conditionally render description since it applies a margin even when nothing is displayed */
            }
          </LeftContent>

          <RightText disabled={disabled} testID={`${testID}-right-text`}>
            {rightText}
          </RightText>
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

const Container = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
})

const LeftContent = styled.View({
  flex: 1,
  marginVertical: getSpacing(4),
})

const Label = styled(Typo.ButtonText)<{ isHover?: boolean }>(({ theme, disabled, isHover }) => ({
  color: disabled ? theme.colors.greyDark : undefined,
  textDecoration: isHover ? 'underline' : undefined,
}))

const Description = styled(Typo.Caption)<{ isHover?: boolean }>(({ theme, disabled, isHover }) => ({
  marginTop: getSpacing(1),
  color: disabled ? theme.colors.greySemiDark : theme.colors.greyDark,
  textDecoration: isHover ? 'underline' : undefined,
}))

const RightText = styled(Typo.Body)(({ theme, disabled }) => ({
  color: disabled ? theme.colors.greyDark : theme.colors.black,
}))
