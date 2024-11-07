import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { useIsUserUnderageBeneficiary } from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { parseCurrencyFromCents } from 'libs/parsers/getDisplayPrice'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type BeneficiaryCeilingsProps = {
  domainsCredit: DomainsCredit
}

export function BeneficiaryCeilings({ domainsCredit }: BeneficiaryCeilingsProps) {
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
            <BodySecondary>{parseCurrencyFromCents(domainsCredit.digital.remaining)}</BodySecondary>
            {SPACE}
            en offres numériques.
          </Typo.Body>
        </React.Fragment>
      ) : null}
      {domainsCredit.physical ? (
        <Typo.Body testID="domains-credit-physical">
          dont
          {SPACE}
          <BodySecondary>{parseCurrencyFromCents(domainsCredit.physical.remaining)}</BodySecondary>
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
