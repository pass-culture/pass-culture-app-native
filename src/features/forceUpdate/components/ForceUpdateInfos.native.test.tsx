import React from 'react'
import { Linking } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as PackageJson from 'libs/packageJson'
import { userEvent, render, screen } from 'tests/utils'

import { ForceUpdateInfos } from './ForceUpdateInfos'

const build = 10010005
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(build)

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/forceUpdate/queries/useMinimalBuildNumberQuery')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ForceUpdateInfos/>', () => {
  beforeEach(() => setFeatureFlags())

  it('should log click force update when pressing "Télécharger la dernière version" button', async () => {
    render(<ForceUpdateInfos />)

    await user.press(screen.getByText('Télécharger la dernière version'))

    expect(analytics.logClickForceUpdate).toHaveBeenNthCalledWith(1, build)
  })

  it('should open the web app when pressing "Utiliser la version web"', async () => {
    render(<ForceUpdateInfos />)

    const goToWebappButton = screen.getByText('Utiliser la version web')
    await user.press(goToWebappButton)

    expect(Linking.openURL).toHaveBeenCalledWith(WEBAPP_V2_URL)
  })
})
