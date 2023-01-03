export const parseStringToNumber = (offerId: string): number | undefined => {
  return Number.isNaN(Number(offerId)) ? undefined : Number(offerId)
}
