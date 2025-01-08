import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { EligibleAges } from 'features/tutorial/types'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Spacer, TypoDS } from 'ui/theme'

interface Props {
  age: EligibleAges
}

export const EligibleFooter: FunctionComponent<Props> = ({ age }) => {
  const {
    fifteenYearsOldDeposit,
    sixteenYearsOldDeposit,
    seventeenYearsOldDeposit,
    eighteenYearsOldDeposit,
  } = useDepositAmountsByAge()

  const depositsByAge = {
    15: fifteenYearsOldDeposit,
    16: sixteenYearsOldDeposit,
    17: seventeenYearsOldDeposit,
    18: eighteenYearsOldDeposit,
  }
  const deposit = depositsByAge[age]

  return (
    <React.Fragment>
      <StyledBody>
        {`Vérifie ton identité et active tes ${deposit} de crédit dès maintenant\u00a0!`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        as={ButtonWithLinearGradient}
        navigateTo={{ screen: 'Stepper', params: { from: StepperOrigin.TUTORIAL } }}
        wording="Activer mon crédit"
      />
    </React.Fragment>
  )
}

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
