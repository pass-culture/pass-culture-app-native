import { RotatingTextOptions } from 'features/bookOffer/helpers/useRotatingText'

export const BOOKING_CONFIRMATION_LOADING_MESSAGES: RotatingTextOptions[] = [
  {
    message: 'En cours de confirmation...',
    keepDuration: 5000,
  },
  {
    message: 'Patiente quelques instants...',
    keepDuration: 5000,
  },
  {
    message: 'On y est presque...',
  },
]
