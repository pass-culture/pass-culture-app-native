import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { buildFollowArtistSurveyUrl } from 'features/artist/helpers/buildFollowArtistSurveyUrl'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { Button } from 'ui/designSystem/Button/Button'
import { Bell } from 'ui/svg/icons/Bell'

type Props = {
  artistName: string
  artistId?: string
  offerType?: SearchGroupNameEnumv2
}

export const FollowArtistButton: FunctionComponent<Props> = ({
  artistName,
  artistId,
  offerType,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const handlePress = () => {
    navigate('FakeDoorModal', {
      surveyKey: 'has_seen_follow_artist_fake_door_survey',
      surveyUrl: buildFollowArtistSurveyUrl({ artistId, offerType }),
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
