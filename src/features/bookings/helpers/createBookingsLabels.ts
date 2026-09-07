const COUNT_MAX = 100

type LabelResult = {
  fullCountLabel: string
  accessibilityLabel: string
}

export const createBookingsLabels = (count: number): LabelResult =>
  count >= COUNT_MAX
    ? {
        fullCountLabel: `${COUNT_MAX - 1}+`,
        accessibilityLabel: `Plus de ${COUNT_MAX - 1} réservations`,
      }
    : {
        fullCountLabel: count.toString(),
        accessibilityLabel: count.toString(),
      }
