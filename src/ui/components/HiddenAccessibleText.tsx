import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

export const HiddenAccessibleText = styled(Text).attrs(getTextAttrs())(
  Platform.OS === 'web'
    ? { clipPath: 'inset(50%)', width: '1px', height: '1px', overflow: 'hidden' }
    : { display: 'none' }
)
