import { AdvicesStatus } from 'features/offer/types'

export const getAdvicesStatus = (counter: number | null = 0, arraySize = 0): AdvicesStatus => ({
  total: counter ?? 0,
  hasPublished: arraySize > 0,
  hasUnpublished: (counter ?? 0) - arraySize > 0,
})
