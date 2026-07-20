import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { Button } from 'ui/designSystem/Button/Button'
import { Bell } from 'ui/svg/icons/Bell'

// Same Qualtrics survey as the artist page follow fake door
const FOLLOW_ARTIST_SURVEY_URL = 'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU'

const buildSurveyUrl = (artistId?: string) =>
  artistId ? `${FOLLOW_ARTIST_SURVEY_URL}?artistId=${artistId}` : FOLLOW_ARTIST_SURVEY_URL

type Props = {
  artistName: string
  artistId?: string
}

export const FollowArtistButton: FunctionComponent<Props> = ({ artistName, artistId }) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const handlePress = () => {
    navigate('FakeDoorModal', {
      surveyKey: 'has_seen_follow_artist_fake_door_survey',
      surveyUrl: buildSurveyUrl(artistId),
    })
  }

  return (
    <Button
      wording="Suivre"
      icon={Bell}
      variant="secondary"
      color="neutral"
      size="small"
      accessibilityLabel={`Suivre ${artistName}`}
      onPress={handlePress}
    />
  )
}
