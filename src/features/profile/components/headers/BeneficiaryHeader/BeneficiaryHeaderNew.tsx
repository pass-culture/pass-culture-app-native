import { t } from '@lingui/macro'
import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { BeneficiaryCeilingsNew } from 'features/profile/components/headers/BeneficiaryCeilings/BeneficiaryCeilingsNew'
import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type BeneficiaryHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
}

export function BeneficiaryHeaderNew({
  firstName,
  lastName,
  domainsCredit,
  depositExpirationDate,
}: BeneficiaryHeaderProps) {
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  const name = `${firstName} ${lastName}`
  const displayedExpirationDate = depositExpirationDate
    ? formatToSlashedFrenchDate(depositExpirationDate)
    : ''

  return (
    <Fragment>
      <PageHeader title={name} size="medium" />
      <Container>
        <Row>
          <Typo.Body>{t`Profite de ton crédit jusqu’au` + SPACE}</Typo.Body>
          <Typo.ButtonText>{displayedExpirationDate}</Typo.ButtonText>
        </Row>
        {!!domainsCredit && (
          <Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <CreditInfo totalCredit={domainsCredit.all} />
            <BeneficiaryCeilingsNew
              domainsCredit={domainsCredit}
              isUserUnderageBeneficiary={isUserUnderageBeneficiary}
            />
            <CreditExplanation
              depositExpirationDate={depositExpirationDate}
              isUserUnderageBeneficiary={isUserUnderageBeneficiary}
              domainsCredit={domainsCredit}
            />
          </Fragment>
        )}
      </Container>
    </Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  margin: getSpacing(6),
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
}))

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
