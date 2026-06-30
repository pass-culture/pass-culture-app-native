import React, { FunctionComponent, useEffect, useState } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { SubscribeButtonWithModals } from 'features/home/components/SubscribeButtonWithModals'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { ContentHeader } from 'ui/components/headers/ContentHeader'

type Props = {
  thematicHeader?: ThematicHeader
  headerTransition: Animated.AnimatedInterpolation<string | number>
  homeId: string
  onBackPress: VoidFunction
}

export const ThematicHomeHeader: FunctionComponent<Props> = ({
  thematicHeader,
  headerTransition,
  homeId,
  onBackPress,
}) => {
  const [showSmallSubscriptionButton, setShowSmallSubscriptionButton] = useState(false)

  useEffect(() => {
    const listenerId = headerTransition.addListener(({ value }) => {
      setShowSmallSubscriptionButton(value > 0.5)
    })
    return () => {
      headerTransition.removeListener(listenerId)
    }
  }, [headerTransition])

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
      onBackPress={onBackPress}
      RightElement={
        thematicHeader?.type === ThematicHeaderType.Category ? (
          showSmallSubscriptionButton ? (
            <Animated.View style={{ opacity: smallSubscribeButtonOpacity }}>
              <SubscribeButtonWithModals homeId={homeId} size="small" />
            </Animated.View>
          ) : (
            <SmallSubscribeButtonPlaceholder />
          )
        ) : null
      }
    />
  )
}

const SmallSubscribeButtonPlaceholder = styled.View(({ theme }) => ({
  width: theme.designSystem.size.spacing.xxxl,
}))
