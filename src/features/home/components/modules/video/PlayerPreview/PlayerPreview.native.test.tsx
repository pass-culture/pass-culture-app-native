import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'

import { PlayerPreview } from 'features/home/components/modules/video/PlayerPreview/PlayerPreview'
import { render, screen } from 'tests/utils'

describe('PlayerPreview', () => {
  it('should return duration when defined', () => {
    render(
      <PlayerPreview
        height={300}
        thumbnail={<Image source={{ uri: 'thumbnail.jpg' }} />}
        title="Vidéo"
        duration={{ label: '3min', accessibilityLabel: '3 minutes' }}
      />
    )

    expect(screen.getByText('3min')).toBeOnTheScreen()
  })

  it('should return thumbnail when defined', () => {
    render(
      <PlayerPreview
        height={300}
        thumbnail={<Image source={{ uri: 'thumbnail.jpg' }} />}
        title="Vidéo"
      />
    )

    expect(screen.getByTestId('thumbnailGradient')).toBeOnTheScreen()
  })

  it('should return play icon when onPress event defined', () => {
    render(
      <PlayerPreview
        height={300}
        thumbnail={<Image source={{ uri: 'thumbnail.jpg' }} />}
        title="Vidéo"
        onPress={jest.fn()}
      />
    )

    expect(screen.getByTestId('play-icon')).toBeOnTheScreen()
  })

  it('should return title when defined', () => {
    render(
      <PlayerPreview
        height={300}
        thumbnail={<Image source={{ uri: 'thumbnail.jpg' }} />}
        title="Un clip trop stylé"
        onPress={jest.fn()}
      />
    )

    expect(screen.getByText('Un clip trop stylé')).toBeOnTheScreen()
  })
})
