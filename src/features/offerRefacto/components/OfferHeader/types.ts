import { ReactNode } from 'react'
import { Animated } from 'react-native'

import { OfferResponseV2 } from 'api/gen'
import { ShareContent } from 'libs/share/types'

export type AnimationState = {
  iconBackgroundColor: Animated.AnimatedInterpolation<string | number>
  iconBorderColor: Animated.AnimatedInterpolation<string | number>
  transition: Animated.AnimatedInterpolation<string | number>
}

export type UseOfferHeaderParams = {
  offer: OfferResponseV2
  headerTransition: Animated.AnimatedInterpolation<string | number>
}

export type OfferHeaderViewModel = {
  title: string
  animationState: AnimationState
  shareModal: {
    isVisible: boolean
    content: ShareContent | null
    title: string
  }
  onBackPress: () => void
  onSharePress: () => void
  onDismissShareModal: () => void
}

export type OfferHeaderViewProps = {
  viewModel: OfferHeaderViewModel
  headerTransition: Animated.AnimatedInterpolation<string | number>
  children?: ReactNode
}
