import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { FollowArtistButton } from 'features/artist/components/FollowArtistButton/FollowArtistButton'
import { render, screen } from 'tests/utils'

describe('<FollowArtistButton />', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('should display the follow button with an accessible label', () => {
    render(<FollowArtistButton artistName="Edith Piaf" artistId="1" />)

    expect(screen.getByLabelText('Suivre Edith Piaf')).toBeOnTheScreen()
  })
})
