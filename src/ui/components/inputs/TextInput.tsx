import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
import { StyledInputContainer } from './StyledInputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

interface Props extends TextInputProps {
  isRequiredField?: boolean
}

const WithRefTextInput: React.ForwardRefRenderFunction<RNTextInput, Props> = (
  { isRequiredField = false, ...props },
  forwardedRef
) => {
  const [isFocus, setIsFocus] = useState(false)
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)
  const textInputID = uuidv4()

  function onFocus() {
    setIsFocus(true)
  }

  function onBlur() {
    setIsFocus(false)
    if (nativeProps.onBlur) {
      // @ts-expect-error pass event later when needed
      nativeProps.onBlur()
    }
  }

  return (
    <React.Fragment>
      {!!customProps.label && (
        <React.Fragment>
          <LabelContainer>
            <InputLabel htmlFor={textInputID}>{customProps.label}</InputLabel>
            {!!isRequiredField && <RequiredLabel />}
          </LabelContainer>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <StyledInputContainer
        isFocus={isFocus}
        isError={customProps.isError}
        isInputDisabled={customProps.disabled}
        style={customProps.containerStyle}>
        <BaseTextInput
          {...nativeProps}
          nativeID={textInputID}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </StyledInputContainer>
    </React.Fragment>
  )
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)
