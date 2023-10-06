import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'
import { Spacer, Typo } from 'ui/theme'

const INCOMING_CREDIT_LABELS_MAP: Record<number, { label: string; highlightedLabel: string }> = {
  15: { label: 'À venir pour tes 16 ans\u00a0: ', highlightedLabel: '+ 30\u00a0€' },
  16: { label: 'À venir pour tes 17 ans\u00a0: ', highlightedLabel: '+ 30\u00a0€' },
  17: { label: 'À venir pour tes 18 ans\u00a0: ', highlightedLabel: '300\u00a0€' },
}

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
          {!!(age && INCOMING_CREDIT_LABELS_MAP[age]) && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <Typo.Body>
                {INCOMING_CREDIT_LABELS_MAP[age].label}
                <HighlightedBody>
                  {INCOMING_CREDIT_LABELS_MAP[age].highlightedLabel}
                </HighlightedBody>
              </Typo.Body>
            </React.Fragment>
          )}
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

const HighlightedBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))
