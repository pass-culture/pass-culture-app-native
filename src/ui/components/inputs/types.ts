import { ComponentProps, FunctionComponent, RefAttributes } from 'react'
import { TextInput as RNTextInput, ViewStyle } from 'react-native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { ColorsType } from 'theme/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

type InputProps = {
  accessibilityHint?: string
  focusOutlineColor?: ColorsType
}

type CustomTextInputProps = InputProps & {
  label?: string
  isError?: boolean
  format?: string
  disabled?: boolean
  containerStyle?: ViewStyle
  isRequiredField?: boolean
  leftComponent?: React.ReactElement
  rightLabel?: string
  showSoftInputOnFocus?: boolean
  rightButton?: {
    icon: FunctionComponent<AccessibleIcon>
    onPress: () => void
    accessibilityLabel: string
    testID?: string
  }
  Icon?: React.FC
}

type CustomInputTextProps = InputProps & {
  label: string
  errorMessage?: string
  format?: string
  disabled?: boolean
  containerStyle?: ViewStyle
  isRequiredField?: boolean
  leftIcon?: React.FC
  showSoftInputOnFocus?: boolean
  rightButton?: {
    icon: FunctionComponent<AccessibleIcon>
    onPress: () => void
    accessibilityLabel: string
    testID?: string
  }
  characterCount?: number
}

type CustomSearchInputProps = InputProps & {
  label?: string
  inputHeight?: 'small' | 'regular' | 'tall'
  format?: string
  LeftIcon?: React.FC
  onPressRightIcon?: () => void
  searchInputID?: string
  isFocusable?: boolean
  onFocus?: () => void
  inputContainerStyle?: ViewStyle
  children?: React.ReactNode
  isRequiredField?: boolean
  textStyle?: ValueOf<typeof theme.designSystem.typography>
  disableClearButton?: boolean
}

export type RNTextInputProps = Pick<
  ComponentProps<typeof RNTextInput> & { disabled?: boolean; nativeAutoFocus?: boolean },
  /* react-native-web's TextInput supports the prop "disabled"
   * which adds the web property "disabled" (not focusable) to the input
   * https://github.com/necolas/react-native-web/commit/fc033a3161be76224d120dec7aab7009e9414fa7 */
  | 'accessibilityHint'
  | 'accessibilityHidden'
  | 'accessibilityLabel'
  | 'accessibilityRequired'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'autoFocus'
  | 'blurOnSubmit'
  | 'defaultValue'
  | 'disabled'
  | 'editable'
  | 'focusable'
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

export type InputTextProps = CustomInputTextProps & RNTextInputProps

export type SearchInputProps = CustomSearchInputProps & RNTextInputProps

function getInputProps<Props extends InputProps>(props: Props): InputProps {
  return {
    accessibilityHint: props.accessibilityHint,
    focusOutlineColor: props.focusOutlineColor,
  }
}

export function getCustomTextInputProps(props: TextInputProps): CustomTextInputProps {
  return {
    ...getInputProps(props),
    label: props.label,
    isError: props.isError,
    disabled: props.disabled,
    containerStyle: props.containerStyle,
    isRequiredField: props.isRequiredField,
    leftComponent: props.leftComponent,
    rightLabel: props.rightLabel,
    rightButton: props.rightButton,
  }
}

export function getCustomInputTextProps(props: InputTextProps): CustomInputTextProps {
  return {
    ...getInputProps(props),
    label: props.label,
    errorMessage: props.errorMessage,
    disabled: props.disabled,
    containerStyle: props.containerStyle,
    isRequiredField: props.isRequiredField,
    leftIcon: props.leftIcon,
    rightButton: props.rightButton,
    format: props.format,
    characterCount: props.characterCount,
  }
}

export function getCustomSearchInputProps(props: SearchInputProps): CustomSearchInputProps {
  return {
    ...getInputProps(props),
    label: props.label,
    inputHeight: props.inputHeight,
    LeftIcon: props.LeftIcon,
    onPressRightIcon: props.onPressRightIcon,
    inputContainerStyle: props.inputContainerStyle,
    children: props.children,
    isFocusable: props.isFocusable,
    onFocus: props.onFocus,
    isRequiredField: props.isRequiredField,
    disableClearButton: props.disableClearButton,
  }
}

export function getRNTextInputProps(props: TextInputProps): RNTextInputProps {
  return {
    accessibilityLabel: props.accessibilityLabel,
    autoCapitalize: props.autoCapitalize,
    autoComplete: props.autoComplete,
    autoCorrect: props.autoCorrect,
    autoFocus: props.autoFocus,
    blurOnSubmit: props.blurOnSubmit,
    defaultValue: props.defaultValue,
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
    testID: props.testID,
    value: props.value,
    nativeAutoFocus: props.nativeAutoFocus,
  }
}
