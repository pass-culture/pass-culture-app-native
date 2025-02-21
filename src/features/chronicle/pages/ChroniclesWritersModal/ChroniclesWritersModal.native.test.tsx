import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { env } from 'libs/environment/env'
import { render, screen, userEvent } from 'tests/utils'

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
})

jest.mock('features/navigation/helpers/navigateToHome')

const defaultEnvironment = env.ENV

const user = userEvent.setup()

jest.useFakeTimers()

describe('<ChroniclesWritersModal/>', () => {
  afterEach(() => {
    env.ENV = defaultEnvironment
  })

  it('should render correctly', () => {
    render(<ChroniclesWritersModal isVisible closeModal={jest.fn} />)

    expect(
      screen.getByText('Les avis du book club sont écrits par des jeunes passionnés de lecture.')
    ).toBeOnTheScreen()
  })

  it('should navigate to recommandation thematic home when pressing button in production', async () => {
    env.ENV = 'production'

    render(<ChroniclesWritersModal isVisible closeModal={jest.fn} />)

    await user.press(screen.getByText('Voir toutes les recos du book club'))

    expect(mockNavigate).toHaveBeenNthCalledWith(1, 'ThematicHome', {
      homeId: '4mlVpAZySUZO6eHazWKZeV',
      from: 'chronicles',
    })
  })

  it('should close the modal when pressing close button', async () => {
    const mockCloseModal = jest.fn()

    render(<ChroniclesWritersModal isVisible closeModal={mockCloseModal} />)

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })
})
