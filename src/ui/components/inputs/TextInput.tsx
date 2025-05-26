import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { styledButton } from 'ui/components/buttons/styledButton'
import { FlexInputLabel } from 'ui/components/InputLabel/FlexInputLabel'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Typo } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

const WithRefTextInput: React.ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  { ...props },
  forwardedRef
) => {
  const { onFocus, onBlur: onBlurDefault, isFocus } = useHandleFocus()
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)
  const textInputID = uuidv4()

  const Icon = customProps.rightButton?.icon
  const StyledIcon =
    Icon &&
    styled(Icon).attrs(({ theme }) => ({
      color: theme.designSystem.color.icon.default,
      size: theme.icons.sizes.small,
    }))``

  function onBlur() {
    onBlurDefault()
    if (nativeProps.onBlur) {
      // @ts-expect-error pass event later when needed
      nativeProps.onBlur()
    }
  }

  return (
    <ContainerWithMaxWidth>
      {customProps.label ? (
        <FlexInputLabel htmlFor={textInputID}>
          <StyledLabelContainer>
            <Typo.Body>{customProps.label}</Typo.Body>
            <RightLabel
              isRequiredField={customProps.isRequiredField}
              rightLabel={customProps.rightLabel}
            />
          </StyledLabelContainer>
        </FlexInputLabel>
      ) : null}
      {props.format ? (
        <StyledView>
          <Subtitle>{`Exemple\u00a0: ${props.format}`}</Subtitle>
        </StyledView>
      ) : null}
      <InputContainer
        isFocus={isFocus}
        isError={customProps.isError}
        isDisabled={customProps.disabled}
        style={customProps.containerStyle}>
        {customProps.leftComponent ? <StyledView>{customProps.leftComponent}</StyledView> : null}
        <BaseTextInput
          {...nativeProps}
          nativeID={textInputID}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          accessibilityRequired={customProps.isRequiredField}
          accessibilityDescribedBy={customProps.accessibilityDescribedBy}
          multiline={props.multiline}
        />
        {customProps.rightButton && StyledIcon ? (
          <IconContainer>
            <IconTouchableOpacity
              testID={customProps.rightButton.testID}
              accessibilityLabel={customProps.rightButton.accessibilityLabel}
              onPress={customProps.rightButton.onPress}>
              <StyledIcon />
            </IconTouchableOpacity>
          </IconContainer>
        ) : null}
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)

type RightLabelProps = {
  isRequiredField?: boolean
  rightLabel?: string
}
const RightLabel = ({ isRequiredField, rightLabel }: RightLabelProps) => {
  if (isRequiredField) return <RequiredLabel />
  if (rightLabel) return <Subtitle>{rightLabel}</Subtitle>
  return null
}

const IconTouchableOpacity = styledButton(Touchable)({
  maxWidth: getSpacing(15),
})

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledView = styled.View({
  marginBottom: getSpacing(2),
})

const IconContainer = styled.View({
  marginTop: getSpacing(2),
})

const StyledLabelContainer = styled(LabelContainer)({
  marginBottom: getSpacing(2),
})
