import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { render } from 'tests/utils'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'

describe('SystemBanner', () => {
  it('should log analytics on display', () => {
    render(
      <SystemBanner
        title="title"
        subtitle="subtitle"
        accessibilityLabel="label"
        analyticsParams={{ type: 'credit', from: 'home' }}
        onPress={jest.fn()}
        LeftIcon={<React.Fragment />}
      />
    )

    expect(analytics.logSystemBlockDisplayed).toHaveBeenCalledWith({ type: 'credit', from: 'home' })
  })
})
