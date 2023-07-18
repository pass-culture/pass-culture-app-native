import React from 'react'
import styled from 'styled-components/native'

import { SelectableListItem } from 'features/offer/components/SelectableListItem/SelectableListItem'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { getSpacing, Typo } from 'ui/theme'

interface RadioSelectorProps {
  label: string
  onPress: () => void
  description?: string | null
  rightText?: string
  checked?: boolean
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
  const handlePress = () => {
    if (disabled) {
      return
    }
    onPress()
  }

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
