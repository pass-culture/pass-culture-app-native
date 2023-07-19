import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ParentInformationModal } from 'features/identityCheck/components/modals/ParentInformationModal'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { render, screen, fireEvent, waitFor } from 'tests/utils'

const mockHideModal = jest.fn()

describe('ParentInformationModal', () => {
  it("should navigate to Ubble webview when pressing Vérifier l'identité avec mon enfant", async () => {
    render(<ParentInformationModal isVisible hideModal={mockHideModal} />)

    const button = screen.getByText('Vérifier l’identité avec mon enfant')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('UbbleWebview', undefined)
    })
  })

  it('should close modal when pressing Vérifier son identité plus tard', () => {
    render(<ParentInformationModal isVisible hideModal={mockHideModal} />)

    const button = screen.getByText('Vérifier son identité plus tard')
    fireEvent.press(button)

    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })
})
