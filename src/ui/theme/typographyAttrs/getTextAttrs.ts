import { Platform } from 'react-native'

export const getTextAttrs = (dir?: string) => (Platform.OS === 'web' ? { dir: dir ?? 'ltr' } : {})
