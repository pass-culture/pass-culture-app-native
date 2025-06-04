import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CreditBlock } from 'features/onboarding/components/CreditBlock'
import { CreditStatus } from 'features/onboarding/enums'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  age: number
  creditStatus: CreditStatus
  onPress: () => void
  children?: React.ReactNode
}

export const AgeCreditBlock: FunctionComponent<Props> = ({
  age,
  creditStatus,
  onPress,
  children,
}) => {
  const AgeText = creditStatus === CreditStatus.ONGOING ? BodySecondary : CaptionNeutralInfo

  const statusIsOngoing = creditStatus === CreditStatus.ONGOING

  return (
    <CreditBlock creditStatus={creditStatus} animated={statusIsOngoing} onPress={onPress}>
      <AgeText>{`à ${age} ans`}</AgeText>
      <Spacer.Column numberOfSpaces={1} />
      {children}
    </CreditBlock>
  )
}

const BodySecondary = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
