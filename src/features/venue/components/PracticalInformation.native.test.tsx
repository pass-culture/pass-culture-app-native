import React from 'react'

import { PracticalInformation } from 'features/venue/components/PracticalInformation'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

describe('PracticalInformation', () => {
  it('should display withdrawal information', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueResponseSnap} />))

    expect(await screen.findByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })

  it('should display description information', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueResponseSnap} />))

    expect(
      await screen.findByText(
        ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, labore nesciunt numquam. Id itaque in sed sapiente blanditiis necessitatibus. consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus,'
      )
    ).toBeOnTheScreen()
  })

  it('should display contact block', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueResponseSnap} />))

    expect(await screen.findByText('contact@venue.com')).toBeOnTheScreen()
  })
})
