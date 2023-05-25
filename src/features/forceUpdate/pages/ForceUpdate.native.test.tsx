import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { build } from '../../../../package.json'

import { ForceUpdate } from './ForceUpdate'

export const useMustUpdateApp = jest.fn().mockReturnValue(false)

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
})
