import { ReactNode, isValidElement } from 'react'

import { OfferExtraDataResponse } from 'api/gen'
import { isString } from 'shared/typeguards/isString'

export function getTags(subcategoryLabel: string, extraData?: OfferExtraDataResponse) {
  const cinemaGenres = extraData?.genres?.map((genre) => genre) ?? []

  return [
    subcategoryLabel,
    extraData?.musicType,
    extraData?.musicSubType,
    extraData?.showType,
    extraData?.showSubType,
  ]
    .filter(isString)
    .concat(cinemaGenres)
}

export function getInteractionTagLabel(interactionTag: ReactNode): string | undefined {
  return isValidElement(interactionTag)
    ? (interactionTag.props as { label: string }).label
    : undefined
}
