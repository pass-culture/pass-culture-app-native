import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { useIsUserUnderageBeneficiary } from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { useGetCurrentCurrency } from 'libs/parsers/useGetCurrentCurrency'
import { useGetEuroToXPFRate } from 'libs/parsers/useGetEuroToXPFRate'

type BeneficiaryCeilingsProps = {
  domainsCredit: DomainsCredit
}

export function BeneficiaryCeilings({ domainsCredit }: BeneficiaryCeilingsProps) {
  const currency = useGetCurrentCurrency()
  const euroToXPFRate = useGetEuroToXPFRate()

  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()

  if (isUserUnderageBeneficiary || domainsCredit.all.remaining === 0) return null
  return (
    <React.Fragment>
      {domainsCredit.digital ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <Typo.Body testID="domains-credit-digital">
            dont
            {SPACE}
            <BodySecondary>{formatToFrenchDecimal(domainsCredit.digital.remaining, currency, euroToXPFRate)}</BodySecondary>
            {SPACE}
            en offres numériques.
          </Typo.Body>
        </React.Fragment>
      ) : null}
      {domainsCredit.physical ? (
        <Typo.Body testID="domains-credit-physical">
          dont
          {SPACE}
          <BodySecondary>{formatToFrenchDecimal(domainsCredit.physical.remaining, currency, euroToXPFRate)}</BodySecondary>
          {SPACE}
          en offres physiques.
        </Typo.Body>
      ) : null}
    </React.Fragment>
  )
}

const BodySecondary = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))
