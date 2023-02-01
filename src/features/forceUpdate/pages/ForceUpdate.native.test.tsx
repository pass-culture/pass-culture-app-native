import React from 'react'

import { render } from 'tests/utils'

import { ForceUpdate } from './ForceUpdate'

export const useMustUpdateApp = jest.fn().mockReturnValue(false)

describe('<ForceUpdate/>', () => {
  it('should match snapshot', async () => {
    const renderForceUpdate = await render(<ForceUpdate resetErrorBoundary={() => null} />)
    expect(renderForceUpdate).toMatchSnapshot()
  })
})
