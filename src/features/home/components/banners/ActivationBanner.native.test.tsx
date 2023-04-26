import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { fireEvent, render, waitFor } from 'tests/utils'
import { StyledBicolorUnlock } from 'features/home/components/headers/HomeHeader'

describe('ActivationBanner', () => {
  it('should redirect to stepper on press', async () => {
    const { getByText } = render(
      <ActivationBanner title={'Débloque tes 300\u00a0€'} subtitle={'toto'} icon={StyledBicolorUnlock} />
    )

    fireEvent.press(getByText('Débloque tes 300\u00a0€'))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('IdentityCheckStepper', undefined))
  })
})
