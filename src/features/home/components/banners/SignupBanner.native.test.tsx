import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { fireEvent, render, waitFor } from 'tests/utils'

describe('SignupBanner', () => {
  it('should redirect to signup form on press', async () => {
    const { getByText } = render(<SignupBanner />)

    fireEvent.press(getByText('Débloque ton crédit'))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('SignupForm', undefined))
  })
})
