import React from 'react'

import { OfferResponse, OfferStockResponse } from 'api/gen'
import { formatToCompleteFrenchDateTime } from 'libs/parsers/formatDates'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

const NOT_CANCELLABLE_MESSAGE =
  'En confirmant la réservation, j’accepte son exécution immédiate et renonce à mon droit de rétractation. Une confirmation de cet accord me sera envoyée par email.'

type Props = {
  stock: OfferStockResponse
  offer: Pick<OfferResponse, 'isDigital'>
}

const getCancellationMessage = ({ stock, offer }: Props): string => {
  const { activationCode, cancellationLimitDatetime: limitDate } = stock

  let message = 'Cette réservation est annulable'
  if (limitDate) {
    message =
      new Date(limitDate) < new Date()
        ? NOT_CANCELLABLE_MESSAGE
        : `Cette réservation peut être annulée jusqu’au ${formatToCompleteFrenchDateTime({ date: new Date(limitDate), shouldDisplayWeekDay: false })}`
  }

  if (offer.isDigital && !!activationCode) {
    message = NOT_CANCELLABLE_MESSAGE
  }

  return message
}

export const CancellationDetails: React.FC<Props> = ({ stock, offer }) => {
  return (
    <ViewGap gap={2}>
      <Typo.Title4 {...setTextSemantic('h2')}>Conditions d’annulation</Typo.Title4>
      <Typo.BodyAccentXs>{getCancellationMessage({ stock, offer })}</Typo.BodyAccentXs>
    </ViewGap>
  )
}
