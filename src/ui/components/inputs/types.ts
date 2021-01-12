import { RefAttributes } from 'react'
import { TextInput as RNTextInput } from 'react-native'

export type CustomTextInputProps = {
  isError?: boolean
}
export type CustomSearchInputProps = {
  inputHeight?: 'small' | 'tall'
  LeftIcon?: React.FC
  RightIcon?: React.FC
}

export type RNTextInputProps = Pick<
  React.ComponentProps<typeof RNTextInput>,
  | 'autoCorrect'
  | 'returnKeyType'
  | 'selectionColor'
  | 'onChangeText'
  | 'placeholder'
  | 'value'
  | 'autoFocus'
  | 'keyboardType'
  | 'textContentType'
  | 'secureTextEntry'
  | 'onFocus'
  | 'onBlur'
  | 'maxLength'
  | 'selectTextOnFocus'
  | 'onKeyPress'
  | 'blurOnSubmit'
> &
  RefAttributes<RNTextInput>

export type TextInputProps = CustomTextInputProps & RNTextInputProps
export type SearchInputProps = CustomSearchInputProps & RNTextInputProps

export function getCustomTextInputProps(props: TextInputProps): CustomTextInputProps {
  return { isError: props.isError }
}

export function getCustomSearchInputProps(props: SearchInputProps): CustomSearchInputProps {
  const { inputHeight, LeftIcon, RightIcon } = props
  return { inputHeight, LeftIcon, RightIcon }
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
