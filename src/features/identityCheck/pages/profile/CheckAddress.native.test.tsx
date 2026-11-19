import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { CheckAddress } from 'features/identityCheck/pages/profile/CheckAddress'
import { render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ user: null })),
}))

describe('<CheckAddress />', () => {
  beforeEach(() => {
    useRoute.mockReset()
  })

  it('should ask if the user still lives at the address by default', () => {
    useRoute.mockReturnValueOnce({ params: undefined })

    render(<CheckAddress />)

    expect(screen.getByText('Habites-tu toujours à cette adresse\u00a0?')).toBeOnTheScreen()
  })

  it('should ask the user to verify their information when coming from ChangeAddress', () => {
    useRoute.mockReturnValueOnce({ params: { fromChangeAddress: true } })

    render(<CheckAddress />)

    expect(
      screen.getByText('Vérifie que ces informations sont correctes avant de continuer')
    ).toBeOnTheScreen()
  })
})
