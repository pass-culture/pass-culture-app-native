import React from 'react'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { NoResults } from 'ui/components/NoResults'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export function NoBookingsView() {
  const netInfo = useNetInfoContext()
  const explanationsTitle = 'Aucune réservations en cours.'
  const explanationsContent =
    'Il est possible que certaines réservations ne s’affichent pas hors connexion. Connecte-toi à internet pour vérifier.'

  return !netInfo.isConnected ? (
    <NoResults
      offline
      explanations={`${explanationsTitle} ${DOUBLE_LINE_BREAK} ${explanationsContent}`}
      icon={NoBookings}
    />
  ) : (
    <NoResults
      explanations="Tu n’as pas de réservations en cours. Découvre les offres disponibles sans attendre&nbsp;!"
      icon={NoBookings}
    />
  )
}
