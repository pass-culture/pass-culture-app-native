import { TextInput as RNTextInput } from 'react-native'

export type CustomTextInputProps = {
  isError?: boolean
}

export type RNTextInputProps = Pick<
  React.ComponentProps<typeof RNTextInput>,
  | 'onChangeText'
  | 'placeholder'
  | 'value'
  | 'autoFocus'
  | 'keyboardType'
  | 'textContentType'
  | 'secureTextEntry'
  | 'onFocus'
  | 'onBlur'
>

export type TextInputProps = CustomTextInputProps & RNTextInputProps

export function getCustomTextInputProps(props: TextInputProps): CustomTextInputProps {
  return {
    isError: props.isError,
  }
}

export function getRNTextInputProps(props: TextInputProps): RNTextInputProps {
  return {
    onChangeText: props.onChangeText,
    placeholder: props.placeholder,
    value: props.value,
    autoFocus: props.autoFocus,
    keyboardType: props.keyboardType,
    textContentType: props.textContentType,
  }
}
