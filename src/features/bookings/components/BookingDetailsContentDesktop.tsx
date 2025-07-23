import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

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
    <StyledContainer testID="booking_details_desktop">
      <LeftBlock>{leftBlock}</LeftBlock>
      <RightBlock headerImageHeight={headerImageHeight}>{rightBlock}</RightBlock>
    </StyledContainer>
  )
}

const LeftBlock = styled.View({
  maxWidth: MAX_WIDTH_BLOCKS,
  marginBottom: getSpacing(10),
})

const StyledContainer = styled.View({
  flexDirection: 'row',
  marginLeft: getSpacing(18),
  marginRight: getSpacing(22),
  gap: getSpacing(16),
  marginBottom: getSpacing(14),
})

const RightBlock = styled.View<{
  headerImageHeight: number
}>(({ headerImageHeight }) => ({
  marginTop: headerImageHeight - getSpacing(24),
  maxWidth: MAX_WIDTH_BLOCKS,
  gap: getSpacing(4),
  paddingTop: getSpacing(10),
}))
