import React from 'react'

import { fireEvent, render } from 'tests/utils'

import { flakyReactQueryProviderHOC } from './flakyReactQueryProviderHOC'
import { FlakyUseQueryComponent } from './flakyUseQuery'

describe('<FlakyUseQueryComponent />', () => {
  it('should navigate to bookings and show error snackbar if cancel booking request fails', async () => {
    const { getByText } = render(flakyReactQueryProviderHOC(<FlakyUseQueryComponent />))

    const flakyTrigger = getByText('Flaky test on press')

    fireEvent.press(flakyTrigger)
  })
})
