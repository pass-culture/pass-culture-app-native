import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useDepositAmount } from 'features/auth/api'
import { _ } from 'libs/i18n'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Clock } from 'ui/svg/icons/Clock'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export function YoungerBadge() {
  const depositAmount = useDepositAmount()
  const deposit = formatToFrenchDecimal(depositAmount).replace(' ', '')

  return (
    <Container testID="younger-badge">
      <IconContainer>
        <Clock size={48} />
      </IconContainer>
      <TextContainer>
        <Typo.Caption>
          {_(
            t`Patience ! L’année de tes 18 ans, si tu fais partie d’un des départements éligibles, tu bénéficieras de ${deposit} offerts à dépenser sur l’application.`
          )}
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
