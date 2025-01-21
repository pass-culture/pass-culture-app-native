import React, { FunctionComponent } from 'react'
import { Animated } from 'react-native'

import { ContentHeader } from 'ui/components/headers/ContentHeader'

type Props = {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
  handleGoBack: VoidFunction
}

export const ChroniclesHeader: FunctionComponent<Props> = ({
  headerTransition,
  title,
  handleGoBack,
}) => {
  return (
    <ContentHeader
      headerTitle={title}
      headerTransition={headerTransition}
      titleTestID="chroniclesHeaderName"
      onBackPress={handleGoBack}
    />
  )
}
