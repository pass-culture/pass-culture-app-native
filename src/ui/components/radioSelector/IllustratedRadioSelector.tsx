import React, { useRef } from 'react'
import styled from 'styled-components/native'

import { SelectableListItem } from 'features/offer/components/SelectableListItem/SelectableListItem'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { Spacer, Typo } from 'ui/theme'

interface IllustratedRadioSelectorProps {
  label: string
  onPress: VoidFunction
  checked: boolean
  Illustration: React.FunctionComponent
  disabled?: boolean
  accessibilityLabel?: string
}

export const IllustratedRadioSelector = ({
  label,
  onPress,
  checked,
  Illustration,
  disabled,
  accessibilityLabel,
}: IllustratedRadioSelectorProps) => {
  const containerRef = useRef(null)
  useArrowNavigationForRadioButton(containerRef)

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
        <Container ref={containerRef}>
          <Illustration />
          <Spacer.Column numberOfSpaces={2} />
          <Label disabled={disabled} isHover={isHover}>
            {label}
          </Label>
        </Container>
      )}
      isSelected={checked}
      disabled={disabled}
      contentDirection="column"
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

const Container = styled.View({
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
})

const Label = styled(Typo.ButtonText)<{ isHover?: boolean }>(({ theme, disabled, isHover }) => ({
  color: disabled ? theme.colors.greyDark : undefined,
  textDecoration: isHover ? 'underline' : undefined,
}))
