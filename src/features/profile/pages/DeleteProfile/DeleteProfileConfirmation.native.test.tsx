import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as OpenUrlAPI from 'features/navigation/helpers/openUrl'
import * as useGoBack from 'features/navigation/useGoBack'
import { env } from 'libs/environment/fixtures'
import { fireEvent, render, screen } from 'tests/utils'

import { DeleteProfileConfirmation } from './DeleteProfileConfirmation'

jest.mock('libs/firebase/analytics/analytics')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('DeleteProfileConfirmation', () => {
  it('should match snapshot', () => {
    render(<DeleteProfileConfirmation />)

    expect(screen).toMatchSnapshot()
  })

  it('should go back when clicking on go back button', () => {
    render(<DeleteProfileConfirmation />)

    const goBackButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(goBackButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should open FAQ link when clicking on "Voir la charte des données personnelles" button', () => {
    render(<DeleteProfileConfirmation />)

    const faqButton = screen.getByText('Voir la charte des données personnelles')
    fireEvent.press(faqButton)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_PERSONAL_DATA, undefined, true)
  })

  it('should navigate to home when pressing cancel button', () => {
    render(<DeleteProfileConfirmation />)

    fireEvent.press(screen.getByText('Annuler'))

    expect(navigate).toHaveBeenCalledWith('DeleteProfileReason', undefined)
  })
})
