import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { FollowArtistButton } from 'features/artist/components/FollowArtistButton/FollowArtistButton'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()

jest.useFakeTimers()

describe('<FollowArtistButton />', () => {
  it('should display the follow button with an accessible label', () => {
    render(<FollowArtistButton artistName="Edith Piaf" artistId="1" />)

    expect(screen.getByLabelText('Suivre Edith Piaf')).toBeOnTheScreen()
  })

  it('should open fake door modal with artistId when pressed', async () => {
    render(<FollowArtistButton artistName="Edith Piaf" artistId="1" />)

    await user.press(screen.getByLabelText('Suivre Edith Piaf'))

    expect(navigate).toHaveBeenCalledWith('FakeDoorModal', {
      surveyKey: 'has_seen_follow_artist_fake_door_survey',
      surveyUrl: 'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU?artistId=1',
    })
  })

  it('should open fake door modal without artistId when not provided', async () => {
    render(<FollowArtistButton artistName="Edith Piaf" />)

    await user.press(screen.getByLabelText('Suivre Edith Piaf'))

    expect(navigate).toHaveBeenCalledWith('FakeDoorModal', {
      surveyKey: 'has_seen_follow_artist_fake_door_survey',
      surveyUrl: 'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU',
    })
  })

  it('should open fake door modal with offer type when provided', async () => {
    render(
      <FollowArtistButton
        artistName="Edith Piaf"
        artistId="1"
        offerType={SearchGroupNameEnumv2.LIVRES}
      />
    )

    await user.press(screen.getByLabelText('Suivre Edith Piaf'))

    expect(navigate).toHaveBeenCalledWith('FakeDoorModal', {
      surveyKey: 'has_seen_follow_artist_fake_door_survey',
      surveyUrl:
        'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU?artistId=1&offer_type=LIVRES',
    })
  })
})
