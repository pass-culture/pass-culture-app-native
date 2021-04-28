import { TextInput } from 'react-native'

export const BackspaceKey = 'Backspace'

/**
 * Method exported for test purposes
 */
export function executeInputMethod(
  input: TextInput | SimplifiedTextInputRef['current'] | null,
  method: keyof SimplifiedTextInputRef['current']
) {
  input?.[method]()
}

export type NativePressEvent = {
  nativeEvent: { key: string }
}

export type SimplifiedTextInputRef = {
  current: {
    focus: () => void
    blur: () => void
  }
}

export type InputRefMap =
  | React.MutableRefObject<Record<string, React.RefObject<TextInput>>>
  | {
      current: Record<string, SimplifiedTextInputRef>
    }
