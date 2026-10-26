export const LABEL_TO_QUANTITY = { Solo: 1, Duo: 2 } as const

export type BookingQuantity = (typeof LABEL_TO_QUANTITY)[keyof typeof LABEL_TO_QUANTITY]

type QuantityLabel = keyof typeof LABEL_TO_QUANTITY

const isQuantityLabel = (label: string): label is QuantityLabel =>
  label === 'Solo' || label === 'Duo'

export const getQuantityByLabel = (label: string): BookingQuantity | undefined =>
  isQuantityLabel(label) ? LABEL_TO_QUANTITY[label] : undefined

export const LABEL_BY_QUANTITY: Readonly<Record<number, string>> = Object.fromEntries(
  Object.entries(LABEL_TO_QUANTITY).map(([label, quantity]) => [quantity, label])
)
