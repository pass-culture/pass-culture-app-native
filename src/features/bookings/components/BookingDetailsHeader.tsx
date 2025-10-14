import React from 'react'
import { Animated } from 'react-native'

import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { ContentHeader } from 'ui/components/headers/ContentHeader'

interface Props {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
}

export const BookingDetailsHeader: React.FC<Props> = (props) => {
  const { headerTransition, title } = props

  const { goBack } = useGoBack(...getTabHookConfig('Bookings'))

  return (
    <ContentHeader headerTitle={title} headerTransition={headerTransition} onBackPress={goBack} />
  )
}
