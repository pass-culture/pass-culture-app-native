import { ComponentProps, FunctionComponent, RefAttributes } from 'react'
import { Insets, TextInput as RNTextInput, TextStyle, ViewStyle } from 'react-native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { ColorsType } from 'theme/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

type InputProps = {
  accessibilityHint?: string
  focusOutlineColor?: ColorsType
}

type CustomTextInputBaseProps = InputProps & {
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

export type RequiredIndicator = 'symbol' | 'explicit'

type CustomTextInputProps = InputProps & {
  label: string
  labelStyle?: TextStyle
  errorMessage?: string
  description?: string
  disabled?: boolean
  containerStyle?: ViewStyle
  requiredIndicator?: RequiredIndicator
  leftComponent?: React.ReactElement
  showSoftInputOnFocus?: boolean
  rightButton?: {
    icon: FunctionComponent<AccessibleIcon>
    onPress: () => void
    accessibilityLabel: string
    testID?: string
    hitSlop?: Insets
  }
  characterCount?: number
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
  | 'value'
  | 'multiline'
  | 'enablesReturnKeyAutomatically'
  | 'nativeAutoFocus'
> &
  RefAttributes<RNTextInput> & {
    testID?: string
  }

type TextInputNativeProps = CustomTextInputBaseProps & RNTextInputProps

export type TextInputProps = CustomTextInputProps & Omit<RNTextInputProps, 'placeholder'>

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
    errorMessage: props.errorMessage,
    disabled: props.disabled,
    containerStyle: props.containerStyle,
    requiredIndicator: props.requiredIndicator,
    leftComponent: props.leftComponent,
    rightButton: props.rightButton,
    description: props.description,
    characterCount: props.characterCount,
  }
}

export function getRNTextInputProps(props: TextInputNativeProps): RNTextInputProps {
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
    testID: props.testID,
    value: props.value,
    nativeAutoFocus: props.nativeAutoFocus,
  }
}
