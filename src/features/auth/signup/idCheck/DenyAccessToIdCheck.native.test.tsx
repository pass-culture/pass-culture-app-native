import React from 'react'

import { render } from 'tests/utils'

import { DenyAccessToIdCheckModal } from './DenyAccessToIdCheck'

describe('<DenyAccessToIdCheckModal />', () => {
  const dismissModal = jest.fn()
  it('should match snapshot', async () => {
    const modal = render(<DenyAccessToIdCheckModal visible dismissModal={dismissModal} />)

    expect(modal).toMatchSnapshot()
  })
})
