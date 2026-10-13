export enum CinemaScreeningCardDisabledReason {
  UNAVAILABLE = 'Indisponible',
  INSUFFICIENT_CREDIT = 'Crédit insuffisant',
}

export type CinemaScreeningAccessibility = Partial<
  Record<'audio' | 'visual' | 'mental' | 'motor', string[]>
>

export type CinemaScreeningCardProps = {
  time: string
  languages: string[]
  price: string
  onPress: VoidFunction
  specialEvent?: string
  video?: string[]
  audio?: string[]
  accessibility?: CinemaScreeningAccessibility
  disabledReason?: CinemaScreeningCardDisabledReason
  minHeight?: number
}

export type CinemaScreeningCardComponentProps = CinemaScreeningCardProps & {
  onLayout?: (event: LayoutChangeEvent) => void
}

export type CinemaScreeningCardBaseProps = CinemaScreeningCardComponentProps & {
  hovered?: boolean
  onMouseEnter?: VoidFunction
  onMouseLeave?: VoidFunction
}

export type CinemaScreeningCardStyleProps = {
  minHeight: number
  backgroundColor: string
  borderColor: string
  disabled: boolean
  onMouseEnter?: VoidFunction
  onMouseLeave?: VoidFunction
}

export type CinemaScreeningCardState = 'default' | 'hover' | 'disabled'

export type CinemaScreeningCardColorKeys = {
  background: BackgroundColorKey
  border: BorderColorKey
  title: TextColorKey
  subtitle: TextColorKey
  price: TextColorKey
  icon: IconColorKey
}
import { LayoutChangeEvent } from 'react-native'

import { BackgroundColorKey, BorderColorKey, IconColorKey, TextColorKey } from 'theme/types'
