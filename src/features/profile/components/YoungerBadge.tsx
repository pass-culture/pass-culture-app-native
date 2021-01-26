import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Clock } from 'ui/svg/icons/Clock'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export function YoungerBadge() {
  return (
    <Container>
      <IconContainer>
        <Clock size={48} />
      </IconContainer>
      <TextContainer>
        <Typo.Body>
          {_(
            t`Patience ! L’année de tes 18 ans tu bénéficieras de 300€ offerts à dépenser sur l’application.`
          )}
        </Typo.Body>
      </TextContainer>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
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
