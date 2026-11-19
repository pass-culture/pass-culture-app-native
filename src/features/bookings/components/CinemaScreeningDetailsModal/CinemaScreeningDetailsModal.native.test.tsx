import React from 'react'

import { CinemaScreeningDetailsModal } from 'features/bookings/components/CinemaScreeningDetailsModal/CinemaScreeningDetailsModal'
import { CinemaScreeningDetailsModalProps } from 'features/bookings/components/CinemaScreeningDetailsModal/types'
import { render, screen, userEvent } from 'tests/utils'

const onClose = jest.fn()

const mockScreeningDetails: CinemaScreeningDetailsModalProps['details'] = [
  {
    type: 'tag',
    category: 'special-event',
    label: 'Avant-première',
    description: 'Description de l’événement spécial',
  },
  {
    type: 'tag',
    category: 'video',
    label: 'IMAX',
    description: 'Description du format vidéo',
  },
  {
    type: 'tag',
    category: 'audio',
    label: 'Dolby Atmos',
    description: 'Description du format audio',
  },
  {
    type: 'accessibility',
    category: 'visual',
    label: 'Audio-description GRETA',
    description: 'Description GRETA',
  },
  {
    type: 'accessibility',
    category: 'audio',
    label: 'Sous-titrage CCAP',
    description: 'Description CCAP',
  },
  {
    type: 'accessibility',
    category: 'motor',
    label: 'Accès PMR',
    description: 'Description PMR',
  },
]

const user = userEvent.setup()

describe('<CinemaScreeningDetailsModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display screening details in the expected order', () => {
    render(<CinemaScreeningDetailsModal details={mockScreeningDetails} onClose={onClose} />)

    expect(screen.getByText('Informations sur la séance')).toBeOnTheScreen()
    expect(
      screen.getAllByTestId(/^cinema-screening-detail-/).map((item) => item.props.testID)
    ).toEqual([
      'cinema-screening-detail-special-event-0',
      'cinema-screening-detail-video-1',
      'cinema-screening-detail-audio-2',
      'cinema-screening-detail-visual-3',
      'cinema-screening-detail-audio-4',
      'cinema-screening-detail-motor-5',
    ])
  })

  it('should not display missing screening details', () => {
    render(
      <CinemaScreeningDetailsModal
        onClose={onClose}
        details={[
          {
            type: 'tag',
            category: 'video',
            label: 'IMAX',
            description: 'Description du format vidéo',
          },
        ]}
      />
    )

    expect(screen.getByText('IMAX')).toBeOnTheScreen()
    expect(screen.queryByText('Avant-première')).not.toBeOnTheScreen()
    expect(screen.queryByText('Dolby Atmos')).not.toBeOnTheScreen()
    expect(screen.queryByText('Audio-description GRETA')).not.toBeOnTheScreen()
  })

  it('should close the modal from the primary button', async () => {
    render(<CinemaScreeningDetailsModal details={mockScreeningDetails} onClose={onClose} />)

    await user.press(screen.getByText('Fermer'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should close the modal from the close icon', async () => {
    render(<CinemaScreeningDetailsModal details={mockScreeningDetails} onClose={onClose} />)

    await user.press(screen.getByLabelText('Fermer la modale d’informations sur la séance'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
