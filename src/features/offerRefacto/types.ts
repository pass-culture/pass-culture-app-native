import { ReactNode } from 'react'
import { Animated } from 'react-native'

import { OfferArtist, OfferResponse } from 'api/gen'
import { ShareContent } from 'libs/share/types'

export type HasEnoughCreditType =
  | { hasEnoughCredit: true; message?: never }
  | { hasEnoughCredit: false; message?: string }

export type ArtistsLine = {
  prefix: string
  artists: OfferArtist[]
}

export type UseOfferHeaderParams = {
  offer: OfferResponse
  headerTransition: Animated.AnimatedInterpolation<string | number>
}

export type OfferHeaderViewModel = {
  title: string
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
