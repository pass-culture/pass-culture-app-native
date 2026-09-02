import { Platform } from 'react-native'

/**
 * Exposes an id usable as an IDRef target (aria-labelledby, aria-describedby...)
 * on both platforms: React Native relies on nativeID, the DOM on id.
 */
export const accessibleLabelIdProps = (labelId?: string) =>
  Platform.select({
    web: { id: labelId },
    default: { nativeID: labelId },
  })
