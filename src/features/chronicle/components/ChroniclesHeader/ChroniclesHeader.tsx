import React, { FunctionComponent } from 'react'
import { Animated } from 'react-native'

import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { Spacer } from 'ui/theme'

type Props = {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
}

export const ChroniclesHeader: FunctionComponent<Props> = ({ headerTransition, title }) => {
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))

  return (
    <ContentHeader
      headerTitle={title}
      headerTransition={headerTransition}
      titleTestID="chroniclesHeaderName"
      onBackPress={goBack}
      LeftElement={<Spacer.Row numberOfSpaces={13} />}
      RightElement={<Spacer.Row numberOfSpaces={13} />}
    />
  )
}
