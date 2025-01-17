import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { useIsUserUnderageBeneficiary } from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Spacer, TypoDS } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type BeneficiaryCeilingsProps = {
  domainsCredit: DomainsCredit
}

export function BeneficiaryCeilings({ domainsCredit }: BeneficiaryCeilingsProps) {
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  if (isUserUnderageBeneficiary || domainsCredit.all.remaining === 0) return null
  return (
    <React.Fragment>
      {domainsCredit.digital ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <TypoDS.Body testID="domains-credit-digital">
            dont
            {SPACE}
            <BodySecondary>
              {formatCurrencyFromCents(
                domainsCredit.digital.remaining,
                currency,
                euroToPacificFrancRate
              )}
            </BodySecondary>
            {SPACE}
            en offres numériques.
          </TypoDS.Body>
        </React.Fragment>
      ) : null}
      {domainsCredit.physical ? (
        <TypoDS.Body testID="domains-credit-physical">
          dont
          {SPACE}
          <BodySecondary>
            {formatCurrencyFromCents(
              domainsCredit.physical.remaining,
              currency,
              euroToPacificFrancRate
            )}
          </BodySecondary>
          {SPACE}
          en offres physiques.
        </TypoDS.Body>
      ) : null}
    </React.Fragment>
  )
}

const BodySecondary = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))
