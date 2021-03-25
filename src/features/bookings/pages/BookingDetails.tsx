import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'

export function BookingDetails() {
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  return (
    <React.Fragment>
      <SvgPageHeader title="Page temporaire" />
      <Text>Réservation Id : {params.id}</Text>
    </React.Fragment>
  )
}
