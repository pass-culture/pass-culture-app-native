import React from 'react'

import { DomainsCredit } from 'api/gen/api'
import { Subtitle } from 'features/profile/atoms/Subtitle'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { Spacer } from 'ui/theme'

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
      subtitle={<Subtitle startSubtitle={creditText} boldEndSubtitle={displayedExpirationDate} />}>
      {!!domainsCredit && (
        <React.Fragment>
          {!isDepositExpired && (
            <React.Fragment>
              <CreditInfo totalCredit={domainsCredit.all} />
              <BeneficiaryCeilings domainsCredit={domainsCredit} />
            </React.Fragment>
          )}
          <Spacer.Column numberOfSpaces={1} />
          <CreditExplanation isDepositExpired={isDepositExpired} domainsCredit={domainsCredit} />
        </React.Fragment>
      )}
    </HeaderWithGreyContainer>
  )
}
