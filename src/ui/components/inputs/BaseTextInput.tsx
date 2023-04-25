/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef, useEffect, useRef } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { useE2eTestId } from 'libs/e2e/useE2eTestId'

import { RNTextInputProps } from './types'

export const BaseTextInput = forwardRef<RNTextInput, RNTextInputProps>(function BaseTextInput(
  { nativeAutoFocus, autoFocus, testID, ...props },
  forwardedRef
) {
  const inputRef = useRef<RNTextInput>(null)
  const e2eSelectors = useE2eTestId(testID || 'Champ de texte')

  useEffect(() => {
    if (!inputRef || !inputRef.current) {
      return
    }

    /** BUG FIX for :
     * text input of type password (with secureTextEntry set to True) has not the
     * correct fontFamily despite the style
     */
    props.secureTextEntry &&
      props.value &&
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
    if (!nativeAutoFocus && autoFocus && !inputRef.current.isFocused()) {
      if (Platform.OS === 'ios') {
        inputRef.current.focus()
      } else {
        setTimeout(() => inputRef.current?.focus(), 400)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef.current, nativeAutoFocus, autoFocus, props.secureTextEntry])

  return (
    <StyledTextInput
      {...props}
      {...e2eSelectors}
      autoFocus={nativeAutoFocus ? autoFocus : undefined}
      editable={!props.disabled}
      isEmpty={!props.value}
      placeholder={props.placeholder || ''}
      returnKeyType={props.returnKeyType ?? 'next'}
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
  placeholderTextColor: theme.typography.placeholder.color,
}))<{ isEmpty: boolean }>(({ theme, isEmpty }) => {
  const inputStyle = isEmpty ? theme.typography.placeholder : theme.typography.body
  return {
    flex: 1,
    padding: 0,
    height: '100%',
    ...inputStyle,
    lineHeight: undefined,
    ...(Platform.OS === 'web' && { width: 'inherit' }),
  }
})
