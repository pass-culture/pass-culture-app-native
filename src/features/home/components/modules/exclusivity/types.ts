import { ViewStyle } from 'react-native'

import { ExclusivityModule } from 'features/home/types'

export interface ExclusivityModuleProps {
  title: string
  alt: string
  image: string
  moduleId: string
  offerId?: number
  displayParameters?: ExclusivityModule['displayParameters']
  url?: string
  homeEntryId: string | undefined
  index: number
  style?: ViewStyle
}

export type ExclusivityBannerProps = Omit<ExclusivityModuleProps, 'offerId' | 'url'>
