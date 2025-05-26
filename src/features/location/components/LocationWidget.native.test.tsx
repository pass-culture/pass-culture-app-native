import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { ScreenOrigin } from 'features/location/enums'
import { act, render, screen, userEvent } from 'tests/utils'

jest.unmock('@react-navigation/native')

jest.mock('libs/splashscreen')
const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('LocationWidget', () => {
  it('should show modal when pressing widget', async () => {
    renderLocationWidget()

    const button = screen.getByTestId('Ouvrir la modale de localisation depuis le widget')

    await user.press(button)

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should show tooltip after 1 second and hide 8 seconds after it appeared', async () => {
    jest.useFakeTimers()
    renderLocationWidget()

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    expect(
      screen.getByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).toBeOnTheScreen()

    await act(async () => {
      jest.advanceTimersByTime(8000)
    })

    expect(
      screen.queryByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).not.toBeOnTheScreen()
  })

  it('should hide tooltip when pressing close button', async () => {
    renderLocationWidget()

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    const button = screen.getByLabelText('Fermer le tooltip')

    await user.press(button)

    expect(
      screen.queryByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).not.toBeOnTheScreen()
  })
})

const renderLocationWidget = () => {
  render(
    <NavigationContainer>
      <LocationWidget screenOrigin={ScreenOrigin.HOME} />
    </NavigationContainer>
  )
}
