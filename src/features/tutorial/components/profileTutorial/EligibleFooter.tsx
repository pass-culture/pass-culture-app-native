import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  age: number
}

export const EligibleFooter: FunctionComponent<Props> = ({ age }) => {
  const {
    fifteenYearsOldDeposit,
    sixteenYearsOldDeposit,
    seventeenYearsOldDeposit,
    eighteenYearsOldDeposit,
  } = useDepositAmountsByAge()

  const depositsByAge = new Map<Props['age'], string>([
    [15, fifteenYearsOldDeposit],
    [16, sixteenYearsOldDeposit],
    [17, seventeenYearsOldDeposit],
    [18, eighteenYearsOldDeposit],
  ])
  return (
    <React.Fragment>
      <StyledBody>{`Vérifie ton identité et active tes ${depositsByAge.get(
        age
      )} de crédit dès maintenant\u00a0!`}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        as={ButtonWithLinearGradient}
        navigateTo={{ screen: 'Stepper' }}
        wording={'Activer mon crédit'}
      />
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
