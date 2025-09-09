import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { View, Text } from 'react-native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'

export const Partner: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Partner'>>()
  const { data: venue } = useVenueQuery(params.id)

  return (
    <View>
      <Text>Page partenaire {venue?.name}</Text>
    </View>
  )
}
