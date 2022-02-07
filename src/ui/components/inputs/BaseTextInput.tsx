/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef, useEffect, useRef } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { RNTextInputProps } from './types'

export const BaseTextInput = forwardRef<RNTextInput, RNTextInputProps>(function BaseTextInput(
  props,
  forwardedRef
) {
  const { autoFocus, ...restOfProps } = props

  const inputRef = useRef<RNTextInput>(null)

  useEffect(() => {
    if (!inputRef || !inputRef.current) {
      return
    }

    /** BUG FIX for :
     * text input of type password (with secureTextEntry set to True) has not the
     * correct fontFamily despite the style
     */
    inputRef.current.setNativeProps({ style: { fontFamily: 'Montserrat-Regular' } })

    /** FEATURE HACK for : autoFocus with keyboard display on Android
     * Why / issue : on Android with react-navigation used, the inputs are focused without
     *   displaying the keyboard.
     * Fix :
     *   1. Do NOT set the autoFocus prop on the native TextInput
     *   2. Trigger the ref.focus() function with a setTimeout on mount.
     *     The delay (400ms) must be sufficiently long to let the keyboard go down then up
     *     when navigating between two screens with autofocus inputs. Otherwise, the keyboard won't
     *     be displayed on the second screen.
     */
    if (autoFocus && !inputRef.current.isFocused()) {
      if (Platform.OS === 'ios') {
        inputRef.current.focus()
      } else {
        setTimeout(() => inputRef.current?.focus(), 400)
      }
    }
  }, [inputRef.current, autoFocus, props.secureTextEntry])

  return (
    <StyledTextInput
      {...restOfProps}
      editable={!props.disabled}
      testID={props.testID}
      placeholder={restOfProps.placeholder || ''}
      ref={(ref) => {
        if (ref) {
          /* @ts-expect-error Conflicts between types */
          inputRef.current = ref
          if (forwardedRef) {
            /* @ts-expect-error Conflicts between types */
            forwardedRef.current = ref
          }
        }
      }}
    />
  )
})

const StyledTextInput = styled(RNTextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.greyDark,
}))(({ theme }) => ({
  flex: 1,
  padding: 0,
  color: theme.colors.black,
  fontFamily: theme.fontFamily.regular,
  fontSize: getSpacing(3.75),
  height: '100%',
}))
