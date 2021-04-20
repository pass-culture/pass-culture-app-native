import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Clock } from 'ui/svg/icons/Clock'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export function NonEligibleDepartmentBadge() {
  return (
    <Container testID="non-eligible-department-badge">
      <IconContainer>
        <Clock size={48} />
      </IconContainer>
      <TextContainer>
        <Typo.Caption>
          {t`Patience ! Le pass Culture sera bientôt disponible dans ton département !`}
        </Typo.Caption>
      </TextContainer>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: ColorsEnum.GREY_LIGHT,
  borderRadius: 6,
  padding: getSpacing(4),
})

const IconContainer = styled.View({
  flex: 0.1,
  minWidth: getSpacing(12),
  maxWidth: getSpacing(12),
})
const TextContainer = styled.View({
  flex: 0.85,
})
