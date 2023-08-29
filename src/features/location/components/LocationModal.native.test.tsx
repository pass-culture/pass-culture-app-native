import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { act, render, screen } from 'tests/utils'

const hideModalMock = jest.fn()

describe('LocationModal', () => {
  it('should render correctly if modal visible', async () => {
    renderLocationModal()

    await act(async () => {
      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
      await sleep(300)
    })

    expect(screen).toMatchSnapshot()
  })
})

function renderLocationModal() {
  render(<LocationModal visible dismissModal={hideModalMock} />)
}
