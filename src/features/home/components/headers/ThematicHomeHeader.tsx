import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Animated } from 'react-native'

import { SubscribeButtonWithModals } from 'features/home/components/SubscribeButtonWithModals'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { ToggleButtonSize } from 'ui/components/buttons/ToggleButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'

type Props = {
  thematicHeader?: ThematicHeader
  headerTransition: Animated.AnimatedInterpolation<string | number>
  homeId: string
}

export const ThematicHomeHeader: FunctionComponent<Props> = ({
  thematicHeader,
  headerTransition,
  homeId,
}) => {
  const [showSmallSubscriptionButton, setShowSmallSubscriptionButton] = useState(false)
  const { navigate } = useNavigation<UseNavigationType>()
  const onGoBack = useCallback(() => navigate(...homeNavConfig), [navigate])

  useEffect(() => {
    const listenerId = headerTransition.addListener(({ value }) => {
      setShowSmallSubscriptionButton(value > 0.5)
    })
    return () => {
      headerTransition.removeListener(listenerId)
    }
  }, [headerTransition])

  const mediumSubscriptionButtonOpacity = headerTransition.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const smallSubscribeButtonOpacity = headerTransition.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  return (
    <ContentHeader
      headerTitle={thematicHeader?.title}
      headerTransition={headerTransition}
      customHeaderTitleTransition={smallSubscribeButtonOpacity}
      onBackPress={onGoBack}
      RightElement={
        thematicHeader?.type === ThematicHeaderType.Category ? (
          <React.Fragment>
            {showSmallSubscriptionButton ? (
              <Animated.View style={{ opacity: smallSubscribeButtonOpacity }}>
                <SubscribeButtonWithModals homeId={homeId} size={ToggleButtonSize.SMALL} />
              </Animated.View>
            ) : (
              <Animated.View style={{ opacity: mediumSubscriptionButtonOpacity }}>
                <SubscribeButtonWithModals homeId={homeId} />
              </Animated.View>
            )}
          </React.Fragment>
        ) : null
      }
    />
  )
}
