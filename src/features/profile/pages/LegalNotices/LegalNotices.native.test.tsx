import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { render, fireEvent, screen } from 'tests/utils'

import { LegalNotices } from './LegalNotices'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('LegalNotices', () => {
  it('should render correctly', async () => {
    render(<LegalNotices />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate when the cgu row is clicked', async () => {
    render(<LegalNotices />)

    const row = screen.getByText('Conditions Générales d’Utilisation')
    fireEvent.press(row)

    expect(openUrl).toHaveBeenCalledWith(env.CGU_LINK, undefined, true)
  })

  it('should navigate when the data-privacy-chart row is clicked', async () => {
    render(<LegalNotices />)

    const row = screen.getByText('Charte de protection des données personnelles')
    fireEvent.press(row)

    expect(openUrl).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK, undefined, true)
  })
})
