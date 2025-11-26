export enum BookingsTab {
  CURRENT = 'En cours',
  COMPLETED = 'Terminées',
}

export type BookingsStatus = 'ongoing' | 'ended'

export const mapBookingsStatusToActiveTab = {
  [BookingsTab.CURRENT]: 'ongoing',
  [BookingsTab.COMPLETED]: 'ended',
} as const

export const mapBookingsToActiveTab = {
  [BookingsTab.CURRENT]: 'ongoingBookings',
  [BookingsTab.COMPLETED]: 'endedBookings',
} as const
