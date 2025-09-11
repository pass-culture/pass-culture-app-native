import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { styledButton } from 'ui/components/buttons/styledButton'
import { FlexInputLabel } from 'ui/components/InputLabel/FlexInputLabel'
import { BaseTextInput } from 'ui/components/inputs/BaseTextInput'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
import { InputTextContainer } from 'ui/components/inputs/InputText/InputTextContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import {
  getCustomInputTextProps,
  getRNTextInputProps,
  InputTextProps,
} from 'ui/components/inputs/types'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ErrorFilled } from 'ui/svg/icons/ErrorFilled'
import { getSpacing, Typo } from 'ui/theme'

const WithRefTextInput: React.ForwardRefRenderFunction<RNTextInput, InputTextProps> = (
  { ...props },
  forwardedRef
) => {
  const { onFocus, onBlur: onBlurDefault, isFocus } = useHandleFocus()
  const [textLength, setTextLength] = useState(0)
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomInputTextProps(props)
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

  const handleChangeText = (value: string) => {
    setTextLength(value.length)
    props.onChangeText?.(value)
  }

  const computedAccessibilityLabel = [customProps?.label, customProps?.accessibilityHint]
    .filter(Boolean)
    .join(' - ')

  const LeftIcon = customProps.leftIcon
  const inputLabel = customProps.isRequiredField ? `${customProps.label}\u00A0*` : customProps.label

  return (
    <ContainerWithMaxWidth gap={0}>
      <FlexInputLabel htmlFor={textInputID}>
        <LabelContainer>
          <Typo.Body accessibilityLabel={computedAccessibilityLabel}>{inputLabel}</Typo.Body>
        </LabelContainer>
      </FlexInputLabel>
      {customProps.format ? <Description>{customProps.format}</Description> : null}
      <InputTextContainer
        isFocus={isFocus}
        isError={!!customProps.errorMessage}
        isDisabled={customProps.disabled}
        style={customProps.containerStyle}>
        {LeftIcon ? (
          <IconContainer>
            <LeftIcon />
          </IconContainer>
        ) : null}
        <BaseTextInput
          {...nativeProps}
          nativeID={textInputID}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          accessibilityRequired={customProps.isRequiredField}
          multiline={props.multiline}
          maxLength={customProps.characterCount}
          onChangeText={handleChangeText}
        />
        {customProps.rightButton && StyledIcon ? (
          <IconTouchableOpacity
            testID={customProps.rightButton.testID}
            accessibilityLabel={customProps.rightButton.accessibilityLabel}
            onPress={customProps.rightButton.onPress}>
            <StyledIcon />
          </IconTouchableOpacity>
        ) : null}
      </InputTextContainer>
      {customProps.errorMessage || customProps.characterCount ? (
        <FooterContainer>
          {customProps.errorMessage ? (
            <ErrorContainer>
              <ErrorIcon />
              <ErrorText>{customProps.errorMessage}</ErrorText>
            </ErrorContainer>
          ) : null}
          {customProps.characterCount ? (
            <CounterContainer>
              <Counter>{`${textLength}/${customProps.characterCount}`}</Counter>
            </CounterContainer>
          ) : null}
        </FooterContainer>
      ) : null}
    </ContainerWithMaxWidth>
  )
}

export const InputText = forwardRef<RNTextInput, InputTextProps>(WithRefTextInput)

const IconTouchableOpacity = styledButton(Touchable)({
  maxWidth: getSpacing(15),
})

const Description = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const IconContainer = styled.View(({ theme }) => ({
  flexShrink: 0,
  marginRight: theme.designSystem.size.spacing.s,
}))

const FooterContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  marginTop: theme.designSystem.size.spacing.xs,
}))

const ErrorContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const ErrorText = styled(Typo.BodyAccentS)(({ theme }) => ({
  color: theme.designSystem.color.text.error,
  marginLeft: theme.designSystem.size.spacing.xs,
}))

const ErrorIcon = styled(ErrorFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.error,
  size: theme.icons.sizes.extraSmall,
}))``

const CounterContainer = styled.View({
  marginLeft: 'auto',
  alignItems: 'center',
})

const Counter = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
