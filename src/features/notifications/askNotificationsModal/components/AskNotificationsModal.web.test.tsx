import React from 'react'

import { AskNotificiationsModal } from 'features/notifications/askNotificationsModal/components/AskNotificationsModal'
import { render } from 'tests/utils'

describe('AskNotificationsModal', () => {
  it('Render null in web', () => {
    const component = render(<AskNotificiationsModal visible={true} onHideModal={jest.fn()} />)
    expect(component).toMatchObject({})
  })
})
