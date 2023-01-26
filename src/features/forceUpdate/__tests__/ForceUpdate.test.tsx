import React from 'react'

import { render } from 'tests/utils'

import { ForceUpdate } from '../ForceUpdate'

describe('<ForceUpdate/>', () => {
  it('should match snapshot', async () => {
    const renderForceUpdate = await render(<ForceUpdate resetErrorBoundary={() => null} />)
    expect(renderForceUpdate).toMatchSnapshot()
  })
})
