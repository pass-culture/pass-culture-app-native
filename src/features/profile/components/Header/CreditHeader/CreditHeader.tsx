import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export type CreditHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
}

export function CreditHeader({
  firstName,
  lastName,
  domainsCredit,
  depositExpirationDate,
}: CreditHeaderProps) {
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  const name = `${firstName} ${lastName}`

  const displayedExpirationDate = depositExpirationDate
    ? formatToSlashedFrenchDate(depositExpirationDate)
    : ''
  const isDepositExpired = depositExpirationDate
    ? new Date(depositExpirationDate) < new Date()
    : false

  const creditText = isDepositExpired
    ? t`Ton crédit a expiré le`
    : t`Profite de ton crédit jusqu’au`

  return (
    <React.Fragment>
      <PageHeader title={name} size="medium" />
      <Container>
        <Row>
          <Typo.Body>{creditText + SPACE}</Typo.Body>
          <Typo.ButtonText>{displayedExpirationDate}</Typo.ButtonText>
        </Row>
        {!!domainsCredit && (
          <React.Fragment>
            {!isDepositExpired && (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={4} />
                <CreditInfo totalCredit={domainsCredit.all} />
                <BeneficiaryCeilings
                  domainsCredit={domainsCredit}
                  isUserUnderageBeneficiary={isUserUnderageBeneficiary}
                />
              </React.Fragment>
            )}
            <Spacer.Column numberOfSpaces={1} />
            <CreditExplanation
              isDepositExpired={isDepositExpired}
              isUserUnderageBeneficiary={isUserUnderageBeneficiary}
              domainsCredit={domainsCredit}
            />
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(3),
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
}))

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
