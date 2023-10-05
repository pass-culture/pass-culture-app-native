import React from 'react'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'
import { Spacer, Typo } from 'ui/theme'

export type CreditHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  age?: number
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
}

export function CreditHeader({
  firstName,
  lastName,
  age,
  domainsCredit,
  depositExpirationDate,
}: CreditHeaderProps) {
  const name = `${firstName} ${lastName}`

  const displayedExpirationDate = depositExpirationDate
    ? formatToSlashedFrenchDate(setDateOneDayEarlier(depositExpirationDate))
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
          {age === 15 && <Typo.Body>À venir pour tes 16 ans&nbsp;: + 30&nbsp;€</Typo.Body>}
          {age === 16 && <Typo.Body>À venir pour tes 17 ans&nbsp;: + 30&nbsp;€</Typo.Body>}
          {age === 17 && <Typo.Body>À venir pour tes 18 ans&nbsp;: 300&nbsp;€</Typo.Body>}
          <Spacer.Column numberOfSpaces={1} />
          <CreditExplanation
            isDepositExpired={isDepositExpired}
            domainsCredit={domainsCredit}
            age={age}
          />
        </React.Fragment>
      )}
    </HeaderWithGreyContainer>
  )
}
