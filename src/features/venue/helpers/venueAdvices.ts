import { VenueProAdvice } from 'api/gen'

export const getAdvicesWithoutHeadline = (
  advices: VenueProAdvice[] = [],
  headlineOfferId?: string
) => {
  if (!headlineOfferId) return advices

  const index = advices.findIndex((a) => a.offerId.toString() === headlineOfferId)

  return index === -1 ? advices : advices.filter((_, i) => i !== index)
}

export const getHeadlineAdvice = (advices: VenueProAdvice[] = [], headlineOfferId?: string) => {
  if (!headlineOfferId) return

  return advices.find((a) => a.offerId.toString() === headlineOfferId)
}
