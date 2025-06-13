import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { render } from 'tests/utils'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Everywhere } from 'ui/svg/icons/Everywhere'

jest.mock('libs/firebase/analytics/analytics')

describe('SystemBanner', () => {
  it('should log analytics on display', () => {
    render(
      <SystemBanner
        title="title"
        subtitle="subtitle"
        accessibilityLabel="label"
        analyticsParams={{ type: 'credit', from: 'home' }}
        onPress={jest.fn()}
        leftIcon={Everywhere}
      />
    )

    expect(analytics.logSystemBlockDisplayed).toHaveBeenCalledWith({ type: 'credit', from: 'home' })
  })
})
