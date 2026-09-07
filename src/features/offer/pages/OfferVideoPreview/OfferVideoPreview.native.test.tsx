import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'

import { OfferResponse } from 'api/gen'
import * as useGoBack from 'features/navigation/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { videoOrientationCache } from 'features/offer/helpers/useVideoOrientation/useVideoOrientation'
import { OfferVideoPreview } from 'features/offer/pages/OfferVideoPreview/OfferVideoPreview'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent, waitFor } from 'tests/utils'

const mockOffer = jest.fn((): { data: OfferResponse } => ({
  data: offerResponseSnap,
}))

jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => mockOffer(),
}))

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

let getSizeSpy: jest.SpyInstance | undefined

const mockGetSize = (width: number, height: number) => {
  getSizeSpy = jest
    .spyOn(Image, 'getSize')
    .mockImplementation((_uri, onSuccess) => Promise.resolve(onSuccess?.(width, height)))

  return getSizeSpy
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('<OfferPreview />', () => {
  beforeEach(() => {
    videoOrientationCache.clear()
  })

  afterEach(() => {
    getSizeSpy?.mockRestore()
    getSizeSpy = undefined
  })

  it('should display offer video preview page', () => {
    render(<OfferVideoPreview />)

    expect(screen.getByText('Vidéo Sous les étoiles de Paris - VF')).toBeOnTheScreen()
  })

  it('should execute go back when pressing go back button', async () => {
    render(<OfferVideoPreview />)

    await user.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should send log ConsultVideo when user taps Play on the thumbnail', async () => {
    render(<OfferVideoPreview />)

    const playButton = screen.getByRole('imagebutton')

    await user.press(playButton)

    expect(analytics.logConsultVideo).toHaveBeenCalledWith({
      from: 'offer',
      offerId: '116656',
    })
  })

  it('should keep the offer thumbnail for a landscape video', () => {
    mockGetSize(1920, 1080)

    render(<OfferVideoPreview />)

    expect(screen.getByTestId('video-thumbnail')).toHaveProp('source', {
      uri: offerResponseSnap.video?.thumbUrl,
    })
  })

  it('should use the original ratio thumbnail for a portrait video', async () => {
    mockGetSize(720, 1280)

    render(<OfferVideoPreview />)

    await waitFor(() => {
      expect(screen.getByTestId('video-thumbnail')).toHaveProp('source', {
        uri: `https://i.ytimg.com/vi/${offerResponseSnap.video?.id}/oar2.jpg`,
      })
    })
  })
})
