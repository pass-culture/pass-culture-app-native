import React from 'react'

import { render, screen } from 'tests/utils/web'

import { AskNotificiationsModal } from './AskNotificationsModal'

describe('AskNotificationsModal', () => {
  it('should render null in web', () => {
    render(<AskNotificiationsModal visible onHideModal={jest.fn()} />)
    expect(screen).toMatchObject({})
  })
})
