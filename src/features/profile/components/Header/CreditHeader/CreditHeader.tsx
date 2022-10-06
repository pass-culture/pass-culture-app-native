import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { Spacer, Typo } from 'ui/theme'
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

  const creditText = isDepositExpired ? 'Ton crédit a expiré le' : 'Profite de ton crédit jusqu’au'

  return (
    <HeaderWithGreyContainer
      title={name}
      subtitle={
        <Row>
          <Typo.Body>{creditText + SPACE}</Typo.Body>
          <Typo.ButtonText>{displayedExpirationDate}</Typo.ButtonText>
        </Row>
      }
      content={
        !!domainsCredit && (
          <React.Fragment>
            {!isDepositExpired && (
              <React.Fragment>
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
        )
      }
    />
  )
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
