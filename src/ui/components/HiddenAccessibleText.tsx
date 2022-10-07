import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

export const hiddenAccessibleStyle = {
  display: 'block',
  clipPath: 'inset(50%)',
  width: 1,
  height: 1,
  overflow: 'hidden',
}

export const HiddenAccessibleText = styled(Text)(
  Platform.OS === 'web' ? hiddenAccessibleStyle : { display: 'none' }
)
