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
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
      size: theme.icons.sizes.small,
    }))``

  function onBlur() {
    onBlurDefault()
    if (nativeProps.onBlur) {
      // @ts-expect-error pass event later when needed
      nativeProps.onBlur()
    }
  }

  const RightLabel = () => {
    if (customProps.isRequiredField) return <RequiredLabel />
    if (customProps.rightLabel)
      return <Typo.CaptionNeutralInfo>{customProps.rightLabel}</Typo.CaptionNeutralInfo>
    return <React.Fragment />
  }

  return (
    <ContainerWithMaxWidth>
      {!!customProps.label && (
        <React.Fragment>
          <FlexInputLabel htmlFor={textInputID}>
            <LabelContainer>
              <Typo.Body>{customProps.label}</Typo.Body>
              <RightLabel />
            </LabelContainer>
          </FlexInputLabel>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <InputContainer
        isFocus={isFocus}
        isError={customProps.isError}
        isDisabled={customProps.disabled}
        style={customProps.containerStyle}>
        {customProps.leftComponent ? (
          <React.Fragment>
            {customProps.leftComponent}
            <Spacer.Row numberOfSpaces={2} />
          </React.Fragment>
        ) : null}
        <BaseTextInput
          {...nativeProps}
          nativeID={textInputID}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          accessibilityRequired={customProps.isRequiredField}
          accessibilityDescribedBy={customProps.accessibilityDescribedBy}
        />
        {!!(customProps.rightButton && StyledIcon) && (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={2} />
            <IconTouchableOpacity
              testID={customProps.rightButton.testID}
              accessibilityLabel={customProps.rightButton.accessibilityLabel}
              onPress={customProps.rightButton.onPress}>
              <StyledIcon />
            </IconTouchableOpacity>
          </React.Fragment>
        )}
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)

const IconTouchableOpacity = styledButton(Touchable)({
  maxWidth: getSpacing(15),
})
