import React from 'react'
import styled from 'styled-components/native'

import {
  EDGE_BLOCK_BORDER_RADIUS,
  CREDIT_BLOCK_BORDER_WIDTH,
} from 'features/onboarding/helpers/getBorderStyle'
import { getTagColor } from 'features/onboarding/helpers/getTagColor'
import { CreditStatus } from 'features/onboarding/types'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  status: CreditStatus
  roundedBorders?: 'top' | 'bottom'
}

export const CreditStatusTag: React.FC<Props> = ({ status, roundedBorders }) => {
  return (
    <Container status={status} roundedBorders={roundedBorders}>
      <StyledText status={status}>{status}</StyledText>
    </Container>
  )
}

const StyledText = styled(Typo.Caption)<{ status: CreditStatus }>(({ theme, status }) => ({
  color: status === CreditStatus.GONE ? theme.colors.greyDark : theme.colors.white,
}))

const Container = styled.View<Props>(({ theme, status, roundedBorders }) => ({
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(3),
  borderRadius: getSpacing(0.25),
  borderTopRightRadius:
    roundedBorders === 'top' ? EDGE_BLOCK_BORDER_RADIUS - CREDIT_BLOCK_BORDER_WIDTH : undefined,
  borderBottomLeftRadius: getSpacing(2),
  backgroundColor: getTagColor(theme, status),
  textAlign: 'center',
  alignSelf: 'flex-start',
}))
