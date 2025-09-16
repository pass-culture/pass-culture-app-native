import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { VideoSection } from 'features/offer/components/OfferContent/VideoSection/VideoSection'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const defaultProps = {
  offerId: 123,
  offerSubcategory: SubcategoryIdEnum.SEANCE_CINE,
  videoId: 'abc123',
  title: 'Peppa Pig',
  subtitle: 'le cochon rose',
}

describe('<VideoSection />', () => {
  it('should display Vidéo section', () => {
    render(<VideoSection {...defaultProps} />)

    expect(screen.getByText('Vidéo')).toBeOnTheScreen()
  })

  it('should display container without divider on desktop', () => {
    render(<VideoSection {...defaultProps} />, { theme: { isDesktopViewport: true } })

    expect(screen.getByTestId('video-section-without-divider')).toBeOnTheScreen()
  })

  it('should display container with divider on mobile', () => {
    render(<VideoSection {...defaultProps} />, { theme: { isDesktopViewport: false } })

    expect(screen.getByTestId('video-section-with-divider')).toBeOnTheScreen()
  })
})
