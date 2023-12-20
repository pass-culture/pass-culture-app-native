import React from 'react'

import { OfferMetadataList } from 'features/offerv2/components/OfferMetadataList/OfferMetadataList'
import { render, screen } from 'tests/utils'

describe('OfferMetadataList', () => {
  it('should display metadata list', () => {
    const metadata = [
      { label: 'Label 1', value: 'Value 1' },
      { label: 'Label 2', value: 'Value 2' },
    ]

    render(<OfferMetadataList metadata={metadata} />)

    expect(screen.getByText('Label 1 : ')).toBeOnTheScreen()
    expect(screen.getByText('Value 1')).toBeOnTheScreen()
    expect(screen.getByText('Label 2 : ')).toBeOnTheScreen()
    expect(screen.getByText('Value 2')).toBeOnTheScreen()
  })
})
