import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type BeneficiaryCeilingsProps = {
  isUserUnderageBeneficiary: boolean
  domainsCredit: DomainsCredit
}

export function BeneficiaryCeilings({
  isUserUnderageBeneficiary,
  domainsCredit,
}: BeneficiaryCeilingsProps) {
  if (isUserUnderageBeneficiary || domainsCredit.all.remaining === 0) return <React.Fragment />
  return (
    <React.Fragment>
      {!!domainsCredit.digital && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <Typo.Body testID="domains-credit-digital">
            {t`dont`}
            {SPACE}
            <BodySecondary>{formatToFrenchDecimal(domainsCredit.digital.remaining)}</BodySecondary>
            {SPACE}
            {t`en offres numériques`}
          </Typo.Body>
        </React.Fragment>
      )}
      {!!domainsCredit.physical && (
        <Typo.Body testID="domains-credit-physical">
          {t`dont`}
          {SPACE}
          <BodySecondary>{formatToFrenchDecimal(domainsCredit.physical.remaining)}</BodySecondary>
          {SPACE}
          {t`en offres physiques`}
        </Typo.Body>
      )}
    </React.Fragment>
  )
}

const BodySecondary = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))
