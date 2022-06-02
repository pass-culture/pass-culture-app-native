import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

export const HiddenText = styled(Text)(
  Platform.OS === 'web'
    ? { clipPath: 'inset(50%)', width: '1px', height: '1px', overflow: 'hidden' }
    : { display: 'none' }
)
