import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { useIsUserUnderageBeneficiary } from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type BeneficiaryCeilingsProps = {
  domainsCredit?: DomainsCredit | null
}

export function BeneficiaryCeilings({ domainsCredit }: BeneficiaryCeilingsProps) {
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

  if (isUserUnderageBeneficiary || !domainsCredit || domainsCredit.all.remaining === 0) return null
  return (
    <React.Fragment>
      {domainsCredit.digital ? (
        <Container>
          <Typo.Body testID="domains-credit-digital">
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
          </Typo.Body>
        </Container>
      ) : null}
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.xl,
}))

const BodySecondary = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))
