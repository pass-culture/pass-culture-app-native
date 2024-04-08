import { View } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const ViewGap = styled(View)<{ gap: number }>(({ gap }) => ({
  gap: getSpacing(gap),
}))
