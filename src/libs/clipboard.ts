import Clipboard from '@react-native-clipboard/clipboard'

export const useReadClipboard = (callback: (text: string) => void) => {
  const readClipboard = () => {
    if (Clipboard.hasString()) {
      Clipboard.getString()
        .then(callback)
        .catch(() => null) // die silently
    }
  }

  return readClipboard
}
