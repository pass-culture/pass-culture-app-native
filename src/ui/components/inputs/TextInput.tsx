import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
import { StyledInputContainer } from './StyledInputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

const WithRefTextInput: React.ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  props,
  forwardedRef
) => {
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)
  const { RightIcon = () => <Invalidate size={24} /> } = customProps

  const [isFocus, setIsFocus] = useState(false)

  function onFocus() {
    setIsFocus(true)
  }

  function onBlur() {
    setIsFocus(false)
    if (nativeProps.onBlur) {
      // @ts-ignore pass event later when needed
      nativeProps.onBlur()
    }
  }

  return (
    <React.Fragment>
      {!!customProps.label && (
        <React.Fragment>
          <Typo.Body>{customProps.label}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <StyledInputContainer isFocus={isFocus} isError={customProps.isError}>
        <BaseTextInput {...nativeProps} ref={forwardedRef} onFocus={onFocus} onBlur={onBlur} />
        {!!customProps.RightIcon && <RightIcon />}
      </StyledInputContainer>
    </React.Fragment>
  )
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)
