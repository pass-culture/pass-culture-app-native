import styled from 'styled-components/native'

import { BlurAmount } from 'ui/components/BlurryWrapper/BlurAmount.web'

export const BlurryWrapper = styled.View<{ blurAmount?: BlurAmount }>(
  ({ blurAmount = BlurAmount.LIGHT }) => ({
    backdropFilter: `blur(${blurAmount})`,
    alignItems: 'center',
  })
)
