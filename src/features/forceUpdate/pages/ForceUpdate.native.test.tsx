import React from 'react'
import { Linking } from 'react-native'

import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import * as PackageJson from 'libs/packageJson'
import { fireEvent, render, screen } from 'tests/utils'

import { ForceUpdate } from './ForceUpdate'

const build = 10010005
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(build)

describe('<ForceUpdate/>', () => {
  it('should match snapshot', async () => {
    await render(<ForceUpdate resetErrorBoundary={() => null} />)

    expect(screen).toMatchSnapshot()
  })

  it('should log click force update when pressing "Télécharger la dernière version" button', async () => {
    await render(<ForceUpdate resetErrorBoundary={() => null} />)

    fireEvent.press(screen.getByText('Télécharger la dernière version'))

    expect(analytics.logClickForceUpdate).toHaveBeenNthCalledWith(1, build)
  })

  it('should open the web app when pressing "Utiliser la version web"', async () => {
    await render(<ForceUpdate resetErrorBoundary={() => null} />)

    const goToWebappButton = screen.getByText('Utiliser la version web')
    fireEvent.press(goToWebappButton)

    expect(Linking.openURL).toHaveBeenCalledWith(WEBAPP_V2_URL)
  })
})
