/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useRef } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing } from 'ui/theme'

import { RNTextInputProps } from './types'

export const _BaseTextInput: ForwardRefRenderFunction<TextInput, RNTextInputProps> = (
  props,
  forwardedRef
) => {
  const inputRef = useRef<TextInput>(null)
  /**
   * Following code block is required to solve this bug :
   * text input of type password (with secureTextEntry set to True) has not the
   * correct fontFamily despite the style
   */
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.setNativeProps({ style: { fontFamily: 'Montserrat-Regular' } })
    }
  }, [inputRef.current, props.secureTextEntry])

  return (
    <StyledTextInput
      {...props}
      placeholder={props.placeholder || ''}
      ref={(ref) => {
        if (ref) {
          /* @ts-ignore Conflicts between types */
          inputRef.current = ref
          if (forwardedRef) {
            /* @ts-ignore Conflicts between types */
            forwardedRef.current = ref
          }
        }
      }}
    />
  )
}

export const BaseTextInput = forwardRef<TextInput, RNTextInputProps>(_BaseTextInput)

const StyledTextInput = styled(TextInput).attrs({
  placeholderTextColor: ColorsEnum.GREY_DARK,
})({
  flex: 1,
  padding: 0,
  color: ColorsEnum.BLACK,
  fontFamily: 'Montserrat-Regular',
  fontSize: getSpacing(3.75),
})
