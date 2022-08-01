import { t } from '@lingui/macro'
import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type BeneficiaryCeilingsProps = {
  isUserUnderageBeneficiary: boolean
  domainsCredit?: DomainsCredit | null
}

export function BeneficiaryCeilingsNew({
  isUserUnderageBeneficiary,
  domainsCredit,
}: BeneficiaryCeilingsProps) {
  if (!domainsCredit || isUserUnderageBeneficiary) return <React.Fragment />
  return (
    <Fragment>
      {!!domainsCredit.digital && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <Row testID="domains-credit-digital">
            <Typo.Body>{t`dont` + SPACE}</Typo.Body>
            <BodySecondary>
              {formatToFrenchDecimal(domainsCredit.digital.remaining) + SPACE}
            </BodySecondary>
            <Typo.Body>{t`pour les offres numériques`}</Typo.Body>
          </Row>
        </React.Fragment>
      )}
      {!!domainsCredit.physical && (
        <Row testID="domains-credit-physical">
          <Typo.Body>{t`dont` + SPACE}</Typo.Body>
          <BodySecondary>
            {formatToFrenchDecimal(domainsCredit.physical.remaining) + SPACE}
          </BodySecondary>
          <Typo.Body>{t`pour les sorties`}</Typo.Body>
        </Row>
      )}
    </Fragment>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

const BodySecondary = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))
