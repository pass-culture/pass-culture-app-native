import React, { createRef } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image, View } from 'react-native'

import { render, screen, userEvent, waitFor } from 'tests/utils'

import { YoutubePlayer, YoutubePlayerRef } from './YoutubePlayer'

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
    const { root } = render(<YoutubePlayer height={300} thumbnail={<View />} />)

    expect(root).toBeOnTheScreen()
  })

  it('should have default ref', async () => {
    render(<YoutubePlayer height={300} thumbnail={<View />} ref={mockRef} videoId="id" />)

    await expect(mockRef.current?.getDuration()).resolves.toBe(0)
    await expect(mockRef.current?.getCurrentTime()).resolves.toBe(0)
    await expect(mockRef.current?.getVolume()).resolves.toBe(0)
    await expect(mockRef.current?.getVideoUrl()).resolves.toBe('')
    await expect(mockRef.current?.getAvailablePlaybackRates()).resolves.toMatchObject([0])
    await expect(mockRef.current?.isMuted()).resolves.toBe(false)
    expect(mockRef.current?.seekTo(0, false)).toBe(false)
  })

  it('should display nothing if no thumbnail is given', async () => {
    render(<YoutubePlayer height={300} videoId="id" />)
    await waitFor(() => expect(screen.queryByRole('imagebutton')).not.toBeOnTheScreen())
  })

  it('should be ready when press on thumbnail', async () => {
    const handleOnReady = jest.fn()
    render(
      <YoutubePlayer
        videoId="id"
        height={300}
        thumbnail={<Image source={{ uri: 'thumbnail.jpg' }} />}
        onReady={handleOnReady}
      />
    )

    await user.press(screen.getByRole('imagebutton'))

    await waitFor(() => expect(handleOnReady).toHaveBeenCalledWith())
  })
})
