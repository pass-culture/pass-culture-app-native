import React from 'react'

import { render } from 'tests/utils'

import { AskNotificiationsModal } from './AskNotificationsModal'

describe('AskNotificationsModal', () => {
  it('should render null in web', () => {
    const component = render(<AskNotificiationsModal visible onHideModal={jest.fn()} />)
    expect(component).toMatchObject({})
  })
})
