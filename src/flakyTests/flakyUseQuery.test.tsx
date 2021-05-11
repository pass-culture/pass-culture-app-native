import React from 'react'

import { fireEvent, render } from 'tests/utils'

import { FlakyUseQueryComponent } from './flakyUseQuery'

jest.mock('react-query')

describe('<FlakyUseQueryComponent />', () => {
  it('should navigate to bookings and show error snackbar if cancel booking request fails', async () => {
    const { getByText } = render(<FlakyUseQueryComponent />)

    const flakyTrigger = getByText('Flaky test on press')

    fireEvent.press(flakyTrigger)
  })
})
