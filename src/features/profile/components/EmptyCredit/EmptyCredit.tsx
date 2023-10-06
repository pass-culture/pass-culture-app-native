import React from 'react'
import styled from 'styled-components/native'

import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Typo } from 'ui/theme'

export const EmptyCredit = ({ age }: { age: number }) => {
  const { sixteenYearsOldDeposit, seventeenYearsOldDeposit, eighteenYearsOldDeposit } =
    useDepositAmountsByAge()

  const incomingCreditMap: Record<number, string> = {
    15: sixteenYearsOldDeposit,
    16: seventeenYearsOldDeposit,
    17: eighteenYearsOldDeposit,
  }

  if (!incomingCreditMap[age]) return null

  return (
    <Typo.Body>
      Ton prochain crédit de <HighlightedBody>{incomingCreditMap[age]}</HighlightedBody> sera
      débloqué à {age + 1} ans. En attendant…
    </Typo.Body>
  )
}

const HighlightedBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))
