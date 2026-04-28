import React from 'react'

import { TranscriptionModal } from 'features/home/pages/TranscriptionModal'
import { render, screen, userEvent } from 'tests/utils'

const mockCloseModal = jest.fn()
const mockTranscription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus augue nec ligula dapibus, in varius sapien fermentum. Aenean euismod enim ipsum, a lacinia nulla luctus sed. Ut eget pellentesque augue, sed blandit mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce iaculis nunc sapien, at viverra libero mattis non. Integer imperdiet interdum cursus. Donec convallis sodales purus, sed dapibus mi. Nulla efficitur orci quis ante auctor, a semper odio rhoncus. Nulla mollis aliquet sapien at fermentum. Vivamus pharetra dui odio, ut euismod neque laoreet a.'

const user = userEvent.setup()

jest.useFakeTimers()

describe('TranscriptionModal', () => {
  it('should close the modal when pressing header close button', async () => {
    render(
      <TranscriptionModal
        isVisible
        closeModal={mockCloseModal}
        title="Une vidéo extra"
        transcription={mockTranscription}
      />
    )

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })

  it('should close the modal when pressing bottom close button', async () => {
    render(
      <TranscriptionModal
        isVisible
        closeModal={mockCloseModal}
        title="Une vidéo extra"
        transcription={mockTranscription}
      />
    )

    await user.press(screen.getByText('Fermer'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })
})
