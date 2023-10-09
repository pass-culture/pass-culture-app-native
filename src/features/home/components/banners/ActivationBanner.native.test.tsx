import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { fireEvent, render } from 'tests/utils'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'

describe('ActivationBanner', () => {
  it('should redirect to stepper on press', () => {
    const { getByText } = render(
      <ActivationBanner
        title="Débloque tes 300&nbsp;€"
        subtitle="toto"
        icon={BicolorUnlock}
        from={StepperOrigin.HOME}
      />
    )

    fireEvent.press(getByText('Débloque tes 300\u00a0€'))

    expect(navigate).toHaveBeenCalledWith('Stepper', { from: StepperOrigin.HOME })
  })
})
