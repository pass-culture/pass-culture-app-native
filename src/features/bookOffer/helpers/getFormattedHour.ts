import { formatHour } from 'features/bookOffer/helpers/utils'

export const getFormattedHour = (hour: string | null | undefined) =>
  formatHour(hour).replace(':', 'h')
