import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { RetryActivationBanner } from 'features/home/components/banners/RetryActivationBanner'
import { fireEvent, render, waitFor } from 'tests/utils'

describe('RetryActivationBanner', () => {
  it('should redirect to stepper on press', async () => {
    const { getByText } = render(
      <RetryActivationBanner title={'Retente ubble'} subtitle={'pour débloquer ton crédit'} />
    )

    fireEvent.press(getByText('Retente ubble'))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('IdentityCheckStepper', undefined))
  })
})
