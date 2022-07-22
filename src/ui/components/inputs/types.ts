import { ComponentProps, RefAttributes } from 'react'
import { TextInput as RNTextInput, ViewStyle } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type CustomTextInputProps = {
  isError?: boolean
  label?: string
  disabled?: boolean
  containerStyle?: ViewStyle
  isRequiredField?: boolean
  accessibilityDescribedBy?: string
  focusOutlineColor?: ColorsEnum
  leftComponent?: React.ReactElement
  rightLabel?: string
  showSoftInputOnFocus?: boolean
}

type CustomSearchInputProps = {
  inputHeight?: 'small' | 'regular' | 'tall'
  LeftIcon?: React.FC
  label?: string
  accessibilityLabel?: string
  accessibilityDescribedBy?: string
  onPressRightIcon?: () => void
  focusOutlineColor?: ColorsEnum
  searchInputID?: string
  onFocus?: () => void
  inputContainerStyle?: ViewStyle
  children?: React.ReactNode
}

export type RNTextInputProps = Pick<
  ComponentProps<typeof RNTextInput> & { disabled?: boolean; nativeAutoFocus?: boolean },
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
  | 'enablesReturnKeyAutomatically'
  | 'nativeAutoFocus'
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
    focusOutlineColor: props.focusOutlineColor,
    leftComponent: props.leftComponent,
    rightLabel: props.rightLabel,
  }
}

export function getCustomSearchInputProps(props: SearchInputProps): CustomSearchInputProps {
  return {
    inputHeight: props.inputHeight,
    LeftIcon: props.LeftIcon,
    label: props.label,
    accessibilityLabel: props.accessibilityLabel,
    accessibilityDescribedBy: props.accessibilityDescribedBy,
    onPressRightIcon: props.onPressRightIcon,
    focusOutlineColor: props.focusOutlineColor,
    inputContainerStyle: props.inputContainerStyle,
    children: props.children,
    onFocus: props.onFocus,
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
    nativeAutoFocus: props.nativeAutoFocus,
  }
}
