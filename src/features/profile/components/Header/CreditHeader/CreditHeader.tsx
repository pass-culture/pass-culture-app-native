import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { getHeaderSubtitleProps } from 'features/profile/helpers/getHeaderSubtitleProps'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
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
  const depositAmount = useDepositAmountsByAge()
  const incomingCreditLabelsMap: Record<number, { label: string; highlightedLabel: string }> = {
    15: {
      label: 'À venir pour tes 16 ans\u00a0: ',
      highlightedLabel: `+ ${depositAmount.sixteenYearsOldDeposit}`,
    },
    16: {
      label: 'À venir pour tes 17 ans\u00a0: ',
      highlightedLabel: `+ ${depositAmount.seventeenYearsOldDeposit}`,
    },
    17: {
      label: 'À venir pour tes 18 ans\u00a0: ',
      highlightedLabel: `${depositAmount.eighteenYearsOldDeposit}`,
    },
  }
  const name = `${firstName} ${lastName}`

  const isDepositExpired = depositExpirationDate
    ? new Date(depositExpirationDate) < new Date()
    : false

  const isCreditEmpty = domainsCredit?.all.remaining === 0

  const subtitleProps = getHeaderSubtitleProps({
    isCreditEmpty,
    isDepositExpired,
    depositExpirationDate,
  })

  return (
    <HeaderWithGreyContainer title={name} subtitle={<Subtitle {...subtitleProps} />}>
      {!!domainsCredit && (
        <React.Fragment>
          {!isDepositExpired && (
            <React.Fragment>
              <CreditInfo totalCredit={domainsCredit.all} />
              <BeneficiaryCeilings domainsCredit={domainsCredit} />
            </React.Fragment>
          )}
          {!!(age && incomingCreditLabelsMap[age]) && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <Typo.Body>
                {incomingCreditLabelsMap[age].label}
                <HighlightedBody>{incomingCreditLabelsMap[age].highlightedLabel}</HighlightedBody>
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
