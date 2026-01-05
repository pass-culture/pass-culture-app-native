/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef, useEffect, useRef } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'

import { RNTextInputProps } from './types'

type Typography = ValueOf<typeof theme.designSystem.typography>

type Props = RNTextInputProps & { textStyle?: Typography }

export const BaseTextInput = forwardRef<RNTextInput, Props>(function BaseTextInput(
  { nativeAutoFocus, autoFocus, testID, defaultValue, ...props },
  forwardedRef
) {
  const inputRef = useRef<RNTextInput>(null)

  useEffect(() => {
    if (!inputRef?.current) {
      return
    }

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
      testID={testID || 'Champ de texte'}
      autoFocus={nativeAutoFocus ? autoFocus : undefined}
      editable={!props.disabled}
      isEmpty={!props.value}
      placeholder={props.placeholder || ''}
      returnKeyType={props.returnKeyType ?? 'next'}
      defaultValue={defaultValue}
      textAlignVertical={props.multiline ? 'top' : 'center'} // Only for Android
      multiline={!!props.multiline}
      maxLength={props.maxLength}
      ref={(ref) => {
        if (ref) {
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
  placeholderTextColor: theme.designSystem.color.text.subtle,
}))<{ isEmpty: boolean; textStyle?: Typography; multiline: boolean }>(
  ({ theme, isEmpty, textStyle, editable, multiline }) => {
    let inputStyle: Typography = theme.designSystem.typography.body
    if (isEmpty) {
      inputStyle = theme.designSystem.typography.bodyItalic
    } else if (textStyle) {
      inputStyle = textStyle
    }

    return {
      flex: 1,
      padding: 0,
      paddingTop: multiline ? theme.designSystem.size.spacing.s : 0,
      height: '100%',
      ...inputStyle,
      color: editable
        ? theme.designSystem.color.text.default
        : theme.designSystem.color.text.disabled,
      lineHeight: undefined,
      ...(Platform.OS === 'web' && { width: 'inherit' }),
    }
  }
)
