import React from 'react'

import FastImage from '__mocks__/react-native-fast-image'
import { SubcategoryIdEnum } from 'api/gen'
import { VideoSection } from 'features/offer/components/OfferContent/VideoSection/VideoSection'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const defaultProps = {
  offerId: 123,
  offerSubcategory: SubcategoryIdEnum.SEANCE_CINE,
  videoId: 'abc123',
  title: 'Peppa Pig',
  subtitle: 'le cochon rose',
  videoThumbnail: <FastImage />,
}

const user = userEvent.setup()
jest.useFakeTimers()

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

  it('should send log ConsultVideo when user taps Play on the thumbnail', async () => {
    render(<VideoSection {...defaultProps} />)

    const playButton = screen.getByRole('imagebutton')

    await user.press(playButton)

    expect(analytics.logConsultVideo).toHaveBeenCalledWith({
      from: 'offer',
      offerId: '123',
    })
  })
})
