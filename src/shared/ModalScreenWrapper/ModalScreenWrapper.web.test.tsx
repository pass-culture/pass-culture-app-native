import React from 'react'

import { render, screen, waitFor } from 'tests/utils/web'

import { ModalScreenWrapper } from './ModalScreenWrapper'

const onCloseMock = jest.fn()

const ScreenWithModal = ({ isModalOpen }: { isModalOpen: boolean }) => (
  <React.Fragment>
    <button type="button" aria-label="Ouvrir la modale de localisation" />
    {isModalOpen ? (
      <ModalScreenWrapper title="Localisation" onClose={onCloseMock}>
        {(closeWithTransition, titleId) => (
          <React.Fragment>
            <h1 id={titleId} aria-label="Localisation" />
            <button type="button" aria-label="Fermer la modale" onClick={closeWithTransition} />
            <button type="button" aria-label="Valider" />
          </React.Fragment>
        )}
      </ModalScreenWrapper>
    ) : null}
  </React.Fragment>
)

describe('<ModalScreenWrapper /> on web', () => {
  beforeEach(() => {
    onCloseMock.mockClear()
  })

  it('should follow the ARIA dialog pattern', () => {
    render(<ScreenWithModal isModalOpen />)

    const dialog = screen.getByRole('dialog', { name: 'Localisation' })

    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('should keep the focus inside the modal when tabbing from the last focusable element', async () => {
    render(<ScreenWithModal isModalOpen />)
    const closeButton = screen.getByRole('button', { name: 'Fermer la modale' })
    const submitButton = screen.getByRole('button', { name: 'Valider' })

    submitButton.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))

    await waitFor(() => {
      expect(closeButton).toHaveFocus()
    })
  })
})
