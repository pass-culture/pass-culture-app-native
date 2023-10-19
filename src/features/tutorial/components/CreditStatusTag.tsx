import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/tutorial/enums'
import { getTagColor } from 'features/tutorial/helpers/getTagColor'
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

const StyledText = styled(Typo.Caption)<{ status: CreditStatus }>(({ theme, status }) => ({
  color: status === CreditStatus.GONE ? theme.colors.greyDark : theme.colors.white,
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
