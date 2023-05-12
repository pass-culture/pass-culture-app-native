import React from 'react'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import { fireEvent, render, screen } from 'tests/utils'

const mockUseAuthContext = jest.fn().mockReturnValue({ user: { email: 'example@example.com' } })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

describe('TrackEmailChange', () => {
  it('should renders the component correctly', () => {
    render(<TrackEmailChange />)
    expect(screen.getByText('Suivi de ton changement d’e-mail')).toBeTruthy()
  })

  it('should displays the correct email step cards', () => {
    render(<TrackEmailChange />)

    expect(screen.getByText('Envoie ta demande')).toBeTruthy()
    expect(screen.getByText('Confirme ta demande')).toBeTruthy()
    expect(screen.getByText('Validation de ta nouvelle adresse')).toBeTruthy()
    expect(screen.getByText('Connexion sur ta nouvelle adresse')).toBeTruthy()
  })

  it('should redirect to previous screen when clicking on ArrowPrevious icon', async () => {
    render(<TrackEmailChange />)

    fireEvent.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should sets currentEmail as empty string if user email is not defined', () => {
    mockUseAuthContext.mockReturnValueOnce({ user: { email: null } }), render(<TrackEmailChange />)

    expect(screen.getByText('Depuis l’email envoyé à ')).toHaveTextContent('')
  })
})
