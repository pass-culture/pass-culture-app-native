import { RefAttributes } from 'react'
import { TextInput as RNTextInput, ViewStyle } from 'react-native'

type CustomTextInputProps = {
  isError?: boolean
  label?: string
  disabled?: boolean
  containerStyle?: ViewStyle
  isRequiredField?: boolean
  accessibilityDescribedBy?: string
}

type CustomSearchInputProps = {
  inputHeight?: 'small' | 'tall'
  LeftIcon?: React.FC
  label?: string
  accessibilityLabel?: string
  accessibilityDescribedBy?: string
  onPressRightIcon?: () => void
}

export type RNTextInputProps = Pick<
  React.ComponentProps<typeof RNTextInput> & { disabled?: boolean },
  /* react-native-web's TextInput supports the prop "disabled"
   * which adds the web property "disabled" (not focusable) to the input
   * https://github.com/necolas/react-native-web/commit/fc033a3161be76224d120dec7aab7009e9414fa7 */
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'autoFocus'
  | 'blurOnSubmit'
  | 'editable'
  | 'disabled'
  | 'keyboardType'
  | 'maxLength'
  | 'nativeID'
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
    disabled: props.disabled,
    containerStyle: props.containerStyle,
    isRequiredField: props.isRequiredField,
    accessibilityDescribedBy: props.accessibilityDescribedBy,
  }
}

export function getCustomSearchInputProps(props: SearchInputProps): CustomSearchInputProps {
  const {
    inputHeight,
    LeftIcon,
    label,
    accessibilityLabel,
    accessibilityDescribedBy,
    onPressRightIcon,
  } = props
  return {
    inputHeight,
    LeftIcon,
    label,
    accessibilityLabel,
    accessibilityDescribedBy,
    onPressRightIcon,
  }
}

export function getRNTextInputProps(props: TextInputProps): RNTextInputProps {
  return {
    autoCapitalize: props.autoCapitalize,
    autoComplete: props.autoComplete,
    autoCorrect: props.autoCorrect,
    autoFocus: props.autoFocus,
    blurOnSubmit: props.blurOnSubmit,
    disabled: props.disabled,
    editable: props.editable,
    keyboardType: props.keyboardType,
    maxLength: props.maxLength,
    nativeID: props.nativeID,
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
