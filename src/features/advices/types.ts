import { ReactElement, ReactNode } from 'react'
import { FlatListProps, StyleProp, ViewStyle } from 'react-native'

import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { TagProps } from 'ui/designSystem/Tag/types'

export type AdviceCardData = {
  id: number
  title: string
  subtitle: string
  description: string
  date: string
  tagProps?: TagProps
  image?: string | null
  headerNavigateTo?: InternalNavigationProps['navigateTo']
  headerAccessibilityLabel?: string
}

export type AdviceVariantInfo = {
  labelReaction: string
  titleSection: string
  subtitleSection: string
  subtitleItem: string
  Icon?: React.ReactNode
  modalTitle: string
  modalWording: string
  SmallIcon?: React.ReactNode
  tag?: React.ReactNode
  buttonWording: string
}

export type AdviceCardListProps = Pick<
  FlatListProps<AdviceCardData>,
  | 'data'
  | 'contentContainerStyle'
  | 'horizontal'
  | 'snapToInterval'
  | 'onScroll'
  | 'onContentSizeChange'
  | 'onLayout'
> & {
  offset?: number
  cardWidth?: number
  separatorSize?: number
  headerComponent?: ReactElement
  style?: StyleProp<ViewStyle>
  onSeeMoreButtonPress?: (id: number) => void
  shouldTruncate?: boolean
  cardIcon?: ReactNode
  tag?: ReactNode
}
