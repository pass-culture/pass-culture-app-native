import React from 'react'
import { Linking } from 'react-native'

import { env } from 'libs/environment'
import { fireEvent, render, screen } from 'tests/utils'

import { ForceUpdate } from './ForceUpdate'

describe('<ForceUpdate/>', () => {
  it('should match snapshot', async () => {
    await render(<ForceUpdate resetErrorBoundary={() => null} />)
    expect(screen).toMatchSnapshot()
  })

  it('should open the web app when pressing "Utiliser la version web"', async () => {
    await render(<ForceUpdate resetErrorBoundary={() => null} />)

    const goToWebappButton = screen.getByText('Utiliser la version web')
    fireEvent.press(goToWebappButton)

    expect(Linking.openURL).toHaveBeenCalledWith(`https://${env.WEBAPP_V2_DOMAIN}`)
  })
})
