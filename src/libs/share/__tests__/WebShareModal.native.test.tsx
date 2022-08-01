import React from 'react'

import { ShareAppModal } from 'libs/share/shareApp/ShareAppModal'
import { render } from 'tests/utils'

const dismissModal = jest.fn()

describe('<WebShareModal />', () => {
  it('should not render in native', () => {
    const renderAPI = render(<ShareAppModal visible={true} dismissModal={dismissModal} />)
    expect(renderAPI.toJSON()).toBeNull()
  })
})
