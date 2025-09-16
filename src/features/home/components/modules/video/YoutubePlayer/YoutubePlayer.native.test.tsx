import React, { createRef } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image, View } from 'react-native'

import { render, screen, userEvent, waitFor } from 'tests/utils'

import { YoutubePlayerRef } from './types'
import { YoutubePlayer } from './YoutubePlayer'

describe('YoutubePlayer', () => {
  const user = userEvent.setup()
  const mockRef = createRef<YoutubePlayerRef>()

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should render correctly with thumbnail', () => {
    const { root } = render(<YoutubePlayer height={300} thumbnail={<View />} title="Vidéo" />)

    expect(root).toBeOnTheScreen()
  })

  it('should have default ref', async () => {
    render(
      <YoutubePlayer height={300} thumbnail={<View />} ref={mockRef} videoId="id" title="Vidéo" />
    )

    await expect(mockRef.current?.getDuration()).resolves.toBe(0)
    await expect(mockRef.current?.getCurrentTime()).resolves.toBe(0)
    await expect(mockRef.current?.getVolume()).resolves.toBe(0)
    await expect(mockRef.current?.getVideoUrl()).resolves.toBe('')
    await expect(mockRef.current?.getAvailablePlaybackRates()).resolves.toMatchObject([0])
    await expect(mockRef.current?.isMuted()).resolves.toBe(false)
    expect(mockRef.current?.seekTo(0, false)).toBe(false)
  })

  it('should display nothing if no thumbnail is given', async () => {
    render(<YoutubePlayer height={300} videoId="id" title="Vidéo" />)
    await waitFor(() => expect(screen.queryByRole('imagebutton')).not.toBeOnTheScreen())
  })

  it('should display duration when specified', async () => {
    render(
      <YoutubePlayer
        height={300}
        videoId="id"
        title="Vidéo"
        thumbnail={<Image source={{ uri: 'thumbnail.jpg' }} />}
        duration={{ label: '3min', accessibilityLabel: '3 minutes' }}
        onReady={jest.fn()}
      />
    )

    await screen.findByLabelText('Jouer')

    expect(screen.getByText('3min')).toBeOnTheScreen()
  })

  it('should display video title when specified', async () => {
    render(
      <YoutubePlayer
        height={300}
        videoId="id"
        title="Vidéo"
        thumbnail={<Image source={{ uri: 'thumbnail.jpg' }} />}
        onReady={jest.fn()}
      />
    )

    await screen.findByLabelText('Jouer')

    expect(screen.getByText('Vidéo')).toBeOnTheScreen()
  })

  it('should be ready when press on thumbnail', async () => {
    const handleOnReady = jest.fn()
    render(
      <YoutubePlayer
        videoId="id"
        height={300}
        thumbnail={<Image source={{ uri: 'thumbnail.jpg' }} />}
        onReady={handleOnReady}
        title="Vidéo"
      />
    )

    await user.press(screen.getByLabelText('Jouer'))

    await waitFor(() => expect(handleOnReady).toHaveBeenCalledWith())
  })
})
