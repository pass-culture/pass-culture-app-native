import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Clock } from 'ui/svg/icons/Clock'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export function NonElligibleDepartmentBadge() {
  return (
    <Container testID="non-elligible-department-badge">
      <IconContainer>
        <Clock size={48} />
      </IconContainer>
      <TextContainer>
        <Typo.Caption>
          {t({
            id: 'patience enfin',
            message: 'Patience ! Le pass Culture sera bientôt disponible dans ton département !',
          })}
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
  minWidth: 48,
  maxWidth: 48,
})
const TextContainer = styled.View({
  flex: 0.85,
})
