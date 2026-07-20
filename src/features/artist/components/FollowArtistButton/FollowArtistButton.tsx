import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  buildFollowArtistSurveyUrl,
  FOLLOW_ARTIST_FEATURE_NAME,
  FOLLOW_ARTIST_SURVEY_KEY,
} from 'features/artist/helpers/buildFollowArtistSurveyUrl'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { getHasSeenFakeDoorSurvey } from 'shared/FakeDoorModal/helpers/getHasSeenFakeDoorSurvey'
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

  const handlePress = async () => {
    const hasSeenSurvey = await getHasSeenFakeDoorSurvey(FOLLOW_ARTIST_SURVEY_KEY)

    void analytics.logHasClickedFakeDoorCTA({
      featureName: FOLLOW_ARTIST_FEATURE_NAME,
      from: 'offer',
      artistId,
      hasSeenSurvey,
    })

    navigate('FakeDoorModal', {
      surveyKey: FOLLOW_ARTIST_SURVEY_KEY,
      surveyUrl: buildFollowArtistSurveyUrl({ artistId, offerType }),
      analyticsParams: { featureName: FOLLOW_ARTIST_FEATURE_NAME, from: 'offer', artistId },
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
