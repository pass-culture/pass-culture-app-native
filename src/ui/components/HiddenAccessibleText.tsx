import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

export const hiddenAccessibleStyle = {
  clipPath: 'inset(50%)',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
}

export const HiddenAccessibleText = styled(Text)(
  Platform.OS === 'web' ? hiddenAccessibleStyle : { display: 'none' }
)
