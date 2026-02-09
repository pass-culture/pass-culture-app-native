import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { VenueResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { VenueTopComponentBase } from 'features/venue/components/VenueTopComponent/VenueTopComponentBase'

type Props = {
  venue: Omit<VenueResponse, 'isVirtual'>
}

export const VenueTopComponent: React.FunctionComponent<Props> = ({ venue }) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const handleImagePress = () => {
    navigate('VenuePreviewCarousel', { id: venue.id })
  }

  return <VenueTopComponentBase venue={venue} onPressBannerImage={handleImagePress} />
}
