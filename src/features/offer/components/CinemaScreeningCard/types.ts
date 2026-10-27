import { BackgroundColorKey, BorderColorKey, IconColorKey, TextColorKey } from 'theme/types'

export enum CinemaScreeningCardDisabledReason {
  UNAVAILABLE = 'Indisponible',
  INSUFFICIENT_CREDIT = 'Crédit insuffisant',
  ALREADY_BOOKED = 'Déjà réservé',
  FULLY_BOOKED = 'Complet',
}

type CinemaScreeningAccessibility = Partial<
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
}

export type CinemaScreeningCardComponentProps = CinemaScreeningCardProps & {
  fillHeight?: boolean
  hovered?: boolean
}

export type CinemaScreeningCardStyleProps = {
  backgroundColor: string
  borderColor: string
  disabled: boolean
  fillHeight: boolean
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
