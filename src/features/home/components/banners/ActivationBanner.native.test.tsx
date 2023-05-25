import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { fireEvent, render, waitFor } from 'tests/utils'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'

describe('ActivationBanner', () => {
  it('should redirect to stepper on press', async () => {
    const { getByText } = render(
      <ActivationBanner title={'Débloque tes 300\u00a0€'} subtitle={'toto'} icon={BicolorUnlock} />
    )

    fireEvent.press(getByText('Débloque tes 300\u00a0€'))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('Stepper', undefined))
  })
})
