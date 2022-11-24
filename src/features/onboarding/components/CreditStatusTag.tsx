import React from 'react'
import styled from 'styled-components/native'

import { getTagColor } from 'features/onboarding/helpers/getTagColor'
import { getSpacing, Typo } from 'ui/theme'

export enum CreditStatus {
  GONE = 'passé',
  ONGOING = 'cette année',
  COMING = 'à venir',
}

interface Props {
  status: CreditStatus
}

export const CreditStatusTag: React.FC<Props> = ({ status }) => {
  return (
    <Container status={status}>
      <StyledText status={status}>{status}</StyledText>
    </Container>
  )
}

const StyledText = styled(Typo.Caption)<{ status: CreditStatus }>(({ theme, status }) => ({
  color: status === CreditStatus.GONE ? theme.colors.greyDark : theme.colors.white,
}))

const Container = styled.View<{ status: CreditStatus }>(({ theme, status }) => ({
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(3),
  borderRadius: getSpacing(0.25),
  borderBottomLeftRadius: getSpacing(2),
  backgroundColor: getTagColor(theme, status),
  textAlign: 'center',
  alignSelf: 'flex-start',
}))
