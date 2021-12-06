import { RefAttributes } from 'react'
import { TextInput as RNTextInput } from 'react-native'

export type CustomTextInputProps = {
  isError?: boolean
  label?: string
  RightIcon?: React.FC
  disabled?: boolean
}

export type CustomSearchInputProps = {
  inputHeight?: 'small' | 'tall'
  LeftIcon?: React.FC
  RightIcon?: React.FC
}

export type RNTextInputProps = Pick<
  React.ComponentProps<typeof RNTextInput> & { disabled?: boolean },
  /* react-native-web's TextInput supports the prop "disabled"
   * which adds the web property "disabled" (not focusable) to the input
   * https://github.com/necolas/react-native-web/commit/fc033a3161be76224d120dec7aab7009e9414fa7 */
  | 'autoCapitalize'
  | 'autoCorrect'
  | 'autoFocus'
  | 'blurOnSubmit'
  | 'editable'
  | 'disabled'
  | 'keyboardType'
  | 'maxLength'
  | 'onBlur'
  | 'onChangeText'
  | 'onFocus'
  | 'onKeyPress'
  | 'onSubmitEditing'
  | 'placeholder'
  | 'returnKeyType'
  | 'secureTextEntry'
  | 'selectionColor'
  | 'selectTextOnFocus'
  | 'textContentType'
  | 'value'
  | 'multiline'
> &
  RefAttributes<RNTextInput> & {
    testID?: string
  }

export type TextInputProps = CustomTextInputProps & RNTextInputProps

export type SearchInputProps = CustomSearchInputProps & RNTextInputProps

export function getCustomTextInputProps(props: TextInputProps): CustomTextInputProps {
  return {
    isError: props.isError,
    label: props.label,
    RightIcon: props.RightIcon,
    disabled: props.disabled,
  }
}

export function getCustomSearchInputProps(props: SearchInputProps): CustomSearchInputProps {
  const { inputHeight, LeftIcon, RightIcon } = props
  return { inputHeight, LeftIcon, RightIcon }
}

export function getRNTextInputProps(props: TextInputProps): RNTextInputProps {
  return {
    autoCapitalize: props.autoCapitalize,
    autoCorrect: props.autoCorrect,
    autoFocus: props.autoFocus,
    blurOnSubmit: props.blurOnSubmit,
    disabled: props.disabled,
    editable: props.editable,
    keyboardType: props.keyboardType,
    maxLength: props.maxLength,
    onBlur: props.onBlur,
    onChangeText: props.onChangeText,
    onFocus: props.onFocus,
    onKeyPress: props.onKeyPress,
    onSubmitEditing: props.onSubmitEditing,
    placeholder: props.placeholder,
    returnKeyType: props.returnKeyType,
    secureTextEntry: props.secureTextEntry,
    selectionColor: props.selectionColor,
    selectTextOnFocus: props.selectTextOnFocus,
    textContentType: props.textContentType,
    value: props.value,
  }
}
