import React from 'react'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { NoResultsView } from 'ui/components/NoResultsView'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export function NoBookingsView() {
  const netInfo = useNetInfoContext()

  const title = 'Retrouve tes réservations en un clin d’oeil'

  const explanationsOffline =
    'Aucune réservations en cours.' +
    DOUBLE_LINE_BREAK +
    'Il est possible que certaines réservations ne s’affichent pas hors connexion. Connecte-toi à internet pour vérifier.'

  return !netInfo.isConnected ? (
    <NoResultsView
      title={title}
      offline
      explanations={explanationsOffline}
      icon={NoBookings}
      trackingExplorerOffersFrom="bookings"
    />
  ) : (
    <NoResultsView
      title={title}
      explanations="Tu n’as pas de réservation en cours. Explore le catalogue pour trouver ton bonheur&nbsp;!"
      icon={NoBookings}
      trackingExplorerOffersFrom="bookings"
    />
  )
}
