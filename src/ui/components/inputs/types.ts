import { ComponentProps, FunctionComponent, RefAttributes } from 'react'
import { TextInput as RNTextInput, ViewStyle } from 'react-native'

import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type InputProps = {
  label?: string
  accessibilityDescribedBy?: string
  focusOutlineColor?: ColorsEnum
}

type CustomTextInputProps = InputProps & {
  isError?: boolean
  disabled?: boolean
  containerStyle?: ViewStyle
  isRequiredField?: boolean
  leftComponent?: React.ReactElement
  rightLabel?: string
  showSoftInputOnFocus?: boolean
  rightButton?: {
    icon: FunctionComponent<IconInterface>
    onPress: () => void
    accessibilityLabel: string
    testID?: string
  }
}

type CustomSearchInputProps = InputProps & {
  inputHeight?: 'small' | 'regular' | 'tall'
  LeftIcon?: React.FC
  onPressRightIcon?: () => void
  searchInputID?: string
  isFocusable?: boolean
  onFocus?: () => void
  inputContainerStyle?: ViewStyle
  children?: React.ReactNode
  isRequiredField?: boolean
}

export type RNTextInputProps = Pick<
  ComponentProps<typeof RNTextInput> & { disabled?: boolean; nativeAutoFocus?: boolean },
  /* react-native-web's TextInput supports the prop "disabled"
   * which adds the web property "disabled" (not focusable) to the input
   * https://github.com/necolas/react-native-web/commit/fc033a3161be76224d120dec7aab7009e9414fa7 */
  | 'accessible'
  | 'accessibilityLabel'
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

function getInputProps<Props extends InputProps>(props: Props): InputProps {
  return {
    label: props.label,
    accessibilityDescribedBy: props.accessibilityDescribedBy,
    focusOutlineColor: props.focusOutlineColor,
  }
}

export function getCustomTextInputProps(props: TextInputProps): CustomTextInputProps {
  return {
    ...getInputProps(props),
    isError: props.isError,
    disabled: props.disabled,
    containerStyle: props.containerStyle,
    isRequiredField: props.isRequiredField,
    leftComponent: props.leftComponent,
    rightLabel: props.rightLabel,
    rightButton: props.rightButton,
  }
}

export function getCustomSearchInputProps(props: SearchInputProps): CustomSearchInputProps {
  return {
    ...getInputProps(props),
    inputHeight: props.inputHeight,
    LeftIcon: props.LeftIcon,
    onPressRightIcon: props.onPressRightIcon,
    inputContainerStyle: props.inputContainerStyle,
    children: props.children,
    isFocusable: props.isFocusable,
    onFocus: props.onFocus,
    isRequiredField: props.isRequiredField,
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
