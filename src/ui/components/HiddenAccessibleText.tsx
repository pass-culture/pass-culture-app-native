import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

export const hiddenAccessibleStyle = {
  clipPath: 'inset(50%)',
  width: 1,
  height: 1,
  overflow: 'hidden',
}

export const HiddenAccessibleText = styled(Text)<{ displayBlock?: boolean }>(({ displayBlock }) =>
  Platform.OS === 'web'
    ? {
        ...hiddenAccessibleStyle,
        ...(displayBlock ? { display: 'block' } : {}),
      }
    : { display: 'none' }
)
