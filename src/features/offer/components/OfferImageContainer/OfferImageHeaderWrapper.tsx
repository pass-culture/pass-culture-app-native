import styled from 'styled-components/native'

import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'

export const OfferImageHeaderWrapper = styled(HeaderWithImage)<{ paddingTop?: string | number }>(
  ({ paddingTop }) => ({
    paddingTop,
  })
)
