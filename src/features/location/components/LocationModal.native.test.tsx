import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { render, screen, waitForModalToShow } from 'tests/utils'

const hideModalMock = jest.fn()

describe('LocationModal', () => {
  it('should render correctly if modal visible', async () => {
    renderLocationModal()

    await waitForModalToShow()

    expect(screen).toMatchSnapshot()
  })
})

function renderLocationModal() {
  render(<LocationModal visible dismissModal={hideModalMock} />)
}
