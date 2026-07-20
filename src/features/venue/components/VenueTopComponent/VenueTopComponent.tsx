import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { VenueResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { VenueTopComponentBase } from 'features/venue/components/VenueTopComponent/VenueTopComponentBase'

type Props = {
  venue: VenueResponse
  enableVolunteer?: boolean
  enableVolunteerFeedback?: boolean
  enableVenueFakeDoor?: boolean
  onPressFollowButton?: () => void
}

export const VenueTopComponent: React.FunctionComponent<Props> = ({
  venue,
  enableVolunteer,
  enableVolunteerFeedback,
  enableVenueFakeDoor,
  onPressFollowButton,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const handleImagePress = () => {
    navigate('VenuePreviewCarousel', { id: venue.id })
  }

  return (
    <VenueTopComponentBase
      venue={venue}
      onPressBannerImage={handleImagePress}
      enableVolunteer={enableVolunteer}
      enableVolunteerFeedback={enableVolunteerFeedback}
      enableVenueFakeDoor={enableVenueFakeDoor}
      onPressFollowButton={onPressFollowButton}
    />
  )
}
