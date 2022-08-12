import { t } from '@lingui/macro'
import React from 'react'
import { Animated } from 'react-native'

import { useShareVenue } from 'features/venue/services/useShareVenue'
import { AnimatedHeader } from 'ui/components/headers/AnimatedHeader'
interface Props {
  headerTransition: Animated.AnimatedInterpolation
  title: string
  venueId: number
  description?: string
}

export const VenueHeader: React.FC<Props> = ({
  headerTransition,
  title,
  venueId,
  description,
}: Props) => {
  return (
    <AnimatedHeader
      headerTransition={headerTransition}
      title={title}
      id={venueId}
      metaDescription={description}
      shareButton={{
        onSharePress: useShareVenue,
        shareContentTitle: t`Partager le lieu`,
      }}
    />
  )
}
