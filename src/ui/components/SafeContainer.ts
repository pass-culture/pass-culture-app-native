import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

/**
 * Wrap pages with this container
 * to prevent the status bar from overlapping
 * with the application.
 */
export const SafeContainer = styled(SafeAreaView).attrs({
  edges: ['top'],
  mode: 'padding',
})({
  flex: 1,
})
