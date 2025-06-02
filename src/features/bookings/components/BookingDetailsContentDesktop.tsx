import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

const MARGIN_TICKET_CUTOUT = getSpacing(6)
const MAX_WIDTH_BLOCKS = getSpacing(100)

export const BookingDetailsContentDesktop = ({
  headerImageHeight,
  rightBlock,
  leftBlock,
}: {
  headerImageHeight: number
  rightBlock: React.JSX.Element
  leftBlock: React.JSX.Element
}) => {
  return (
    <StyledContainer>
      <LeftBlock>{leftBlock}</LeftBlock>
      <RightBlock headerImageHeight={headerImageHeight}>{rightBlock}</RightBlock>
    </StyledContainer>
  )
}

const LeftBlock = styled.View({
  maxWidth: getSpacing(112),
  marginBottom: getSpacing(10),
})

const StyledContainer = styled.View({
  flexDirection: 'row',
  marginLeft: getSpacing(18) - MARGIN_TICKET_CUTOUT,
  marginRight: getSpacing(22),
  gap: getSpacing(16) - MARGIN_TICKET_CUTOUT,
  marginBottom: getSpacing(14),
})

const RightBlock = styled.View<{
  headerImageHeight: number
}>(({ headerImageHeight }) => ({
  marginTop: headerImageHeight - getSpacing(32),
  maxWidth: MAX_WIDTH_BLOCKS,
  gap: getSpacing(4),
  paddingTop: getSpacing(10),
}))
