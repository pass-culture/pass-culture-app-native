import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/enums'
import { getTagColor } from 'features/onboarding/helpers/getTagColor'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  status: CreditStatus
}

export const CreditStatusTag: React.FC<Props> = ({ status }) => {
  return (
    <Container status={status}>
      <StyledText status={status} accessibilityHidden>
        {status}
      </StyledText>
    </Container>
  )
}

const StyledText = styled(Typo.BodyAccentXs)<{ status: CreditStatus }>(({ theme, status }) => ({
  color:
    status === CreditStatus.GONE
      ? theme.designSystem.color.text.subtle
      : status === CreditStatus.ONGOING
        ? theme.designSystem.color.text.default
        : theme.designSystem.color.text.lockedInverted,
}))

const Container = styled.View<Props>(({ theme, status }) => ({
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(3),
  borderRadius: getSpacing(0.25),
  borderTopRightRadius: getSpacing(0.75),
  borderBottomLeftRadius: getSpacing(2),
  backgroundColor: getTagColor(theme, status),
  textAlign: 'center',
  alignSelf: 'flex-start',
}))
