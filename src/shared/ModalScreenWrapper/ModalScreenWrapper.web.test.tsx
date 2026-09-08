import React from 'react'

import { render, screen } from 'tests/utils/web'

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
})
