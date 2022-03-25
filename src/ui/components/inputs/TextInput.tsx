import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
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
    <ContainerWithMaxWidth>
      {!!customProps.label && (
        <React.Fragment>
          <LabelContainer>
            <InputLabel htmlFor={textInputID}>{customProps.label}</InputLabel>
            {!!isRequiredField && <RequiredLabel />}
          </LabelContainer>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <InputContainer
        isFocus={isFocus}
        isError={customProps.isError}
        isDisabled={customProps.disabled}
        style={customProps.containerStyle}>
        <BaseTextInput
          {...nativeProps}
          nativeID={textInputID}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-describedby={customProps.accessibilityDescribedBy}
        />
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)
